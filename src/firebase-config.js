// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9ggUbUDuT_esckHJIxi1yFllpJMK9wLc",
  authDomain: "blogsphere-1aba9.firebaseapp.com",
  projectId: "blogsphere-1aba9",
  storageBucket: "blogsphere-1aba9.firebasestorage.app",
  messagingSenderId: "564973892552",
  appId: "1:564973892552:web:cd17b30d531673b4e206fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);