<script type="module">
    import { db, collection, addDoc, onSnapshot, query, orderBy } from './firebase-config.js';

    // --- CORREÇÃO: Torna a função visível para os botões do HTML ---
    window.mudarTela = (id) => {
        console.log("Mudando para a tela:", id); // Para você ver no console se clicou
        document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
        const tela = document.getElementById(id);
        if (tela) {
            tela.classList.remove('hidden');
        } else {
            console.error("Tela não encontrada:", id);
        }
    };

    // --- LÓGICA DO PROFESSOR (ADMIN) ---
    const tipoP = document.getElementById('tipoPergunta');
    const resC = document.getElementById('resCorreta');
    const camposAE = document.getElementById('campos-ae');

    const atualizarGabarito = () => {
        resC.innerHTML = "";
        if(tipoP.value === "VF") {
            camposAE.classList.add('hidden');
            ['Verdadeiro', 'Falso'].forEach(v => {
                let opt = document.createElement('option');
                opt.value = v; opt.innerText = v;
                resC.appendChild(opt);
            });
        } else {
            camposAE.classList.remove('hidden');
            ['A','B','C','D','E'].forEach(v => {
                let opt = document.createElement('option');
                opt.value = v; opt.innerText = v;
                resC.appendChild(opt);
            });
        }
    };
    
    if(tipoP) {
        tipoP.addEventListener('change', atualizarGabarito);
        atualizarGabarito();
    }

    const formP = document.getElementById('form-pergunta');
    if(formP) {
        formP.addEventListener('submit', async (e) => {
            e.preventDefault();
            const novaP = {
                texto: document.getElementById('perguntaTexto').value,
                tipo: tipoP.value,
                correta: resC.value,
                data: Date.now()
            };
            if(tipoP.value === "AE") {
                novaP.opcoes = {
                    A: document.getElementById('optA').value, B: document.getElementById('optB').value,
                    C: document.getElementById('optC').value, D: document.getElementById('optD').value,
                    E: document.getElementById('optE').value
                };
            }
            try {
                await addDoc(collection(db, "quiz_perguntas"), novaP);
                alert("Pergunta salva com sucesso!");
                e.target.reset();
            } catch (err) {
                alert("Erro ao salvar: " + err.message);
            }
        });
    }

    // --- LÓGICA DO ALUNO (JOGO) ---
    let perguntas = [];
    let indexAtual = 0;
    let pontos = 0;
    let nomeUsuario = "";

    const btnEntrar = document.getElementById('btnEntrarQuiz');
    if(btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            nomeUsuario = document.getElementById('nomeAluno').value;
            if(!nomeUsuario) return alert("Por favor, digite seu nome!");
            document.getElementById('labelNome').innerText = "Jogador: " + nomeUsuario;
            window.mudarTela('tela-jogo');
            carregarPerguntas();
        });
    }

    function carregarPerguntas() {
        const q = query(collection(db, "quiz_perguntas"), orderBy("data", "asc"));
        onSnapshot(q, (snap) => {
            perguntas = snap.docs.map(d => ({id: d.id, ...d.data()}));
            if(perguntas.length > 0) {
                mostrarPergunta();
            } else {
                document.getElementById('displayPergunta').innerText = "Nenhuma pergunta cadastrada ainda.";
            }
        });
    }

    function mostrarPergunta() {
        if(indexAtual >= perguntas.length) {
            document.getElementById('displayPergunta').innerText = `Fim de jogo! Pontuação final: ${pontos}`;
            document.getElementById('containerOpcoes').innerHTML = "";
            document.getElementById('btnProxima').classList.add('hidden');
            return;
        }
        
        const p = perguntas[indexAtual];
        document.getElementById('displayPergunta').innerText = p.texto;
        const container = document.getElementById('containerOpcoes');
        container.innerHTML = "";
        document.getElementById('btnProxima').classList.add('hidden');

        const lista = p.tipo === "VF" ? ["Verdadeiro", "Falso"] : ["A","B","C","D","E"];
        
        lista.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "btn-opcao";
            btn.style.margin = "5px 0";
            btn.innerText = p.tipo === "AE" ? `${opt}) ${p.opcoes[opt]}` : opt;
            btn.onclick = () => {
                const todos = container.querySelectorAll('button');
                todos.forEach(b => b.disabled = true);
                
                if(opt === p.correta) {
                    btn.style.backgroundColor = "#4caf50";
                    btn.style.color = "white";
                    pontos += 10;
                    document.getElementById('labelPontos').innerText = `Pontos: ${pontos}`;
                } else {
                    btn.style.backgroundColor = "#f44336";
                    btn.style.color = "white";
                }
                document.getElementById('btnProxima').classList.remove('hidden');
            };
            container.appendChild(btn);
        });
    }

    document.getElementById('btnProxima').addEventListener('click', () => {
        indexAtual++;
        mostrarPergunta();
    });

</script>
