// src/services/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC0RCTT6KJg5plbJLXpIIw7UEgUu0W_qcA",
  authDomain: "login-tutorial-93330.firebaseapp.com",
  projectId: "login-tutorial-93330",
  storageBucket: "login-tutorial-93330.firebasestorage.app",
  messagingSenderId: "74299466751",
  appId: "1:74299466751:web:d54d081ae4bb190187bdca"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
