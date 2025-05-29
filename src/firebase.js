// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW5CmF0t7oiUV2NPyRJcuckDnZYBIX1rI",
  authDomain: "smudgy-app.firebaseapp.com",
  projectId: "smudgy-app",
  storageBucket: "smudgy-app.appspot.com",
  messagingSenderId: "77940955340",
  appId: "1:77940955340:web:ea6f73d1d62ee7cd54a82b",
  measurementId: "G-PMMZW9XVWN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
