import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFv7bxfdGMg2y7YsVkATK_sqtFhx4g-lg",
  authDomain: "agenda-6b09e.firebaseapp.com",
  projectId: "agenda-6b09e",
  storageBucket: "agenda-6b09e.firebasestorage.app",
  messagingSenderId: "848846524028",
  appId: "1:848846524028:web:8ba492a2cffcec35edc3f9",
  measurementId: "G-4WE86DXSSZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, onSnapshot, query, orderBy };
