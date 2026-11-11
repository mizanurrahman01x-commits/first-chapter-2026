// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// PASTE YOUR FIREBASE CONFIG HERE (from Step 2)
const firebaseConfig = {
    apiKey: "AIzaSyBXp1zVqhetobkxVwCo9mr0KLFrJqHfl3o",
  authDomain: "the-first-chapter-2026.firebaseapp.com",
  projectId: "the-first-chapter-2026",
  storageBucket: "the-first-chapter-2026.firebasestorage.app",
  messagingSenderId: "752149893488",
  appId: "1:752149893488:web:56f895f82e54eeea32bfb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged };