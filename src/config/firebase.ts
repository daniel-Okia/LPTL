import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCGKSgWWAaeKG8H5YSG2L4KyxczUZm2QD0",
  authDomain: "lptl-7724a.firebaseapp.com",
  projectId: "lptl-7724a",
  storageBucket: "lptl-7724a.firebasestorage.app",
  messagingSenderId: "572632986265",
  appId: "1:572632986265:web:82b37ff39b2ec95431be08",
  measurementId: "G-2QYPTZJ793"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;