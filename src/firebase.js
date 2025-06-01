import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDESHtXAWYkM4b8_gp9gnf2WT82ykGGkA0",
  authDomain: "tennis-132f6.firebaseapp.com",
  projectId: "tennis-132f6",
  storageBucket: "tennis-132f6.firebasestorage.app",
  messagingSenderId: "341700799496",
  appId: "1:341700799496:web:74ff11ace758209143f5bd",
  measurementId: "G-55JBC7SLF5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
