import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIS9Cxw21yjsfVAX47lRibuHBsazBzIlY",
  authDomain: "improved-dnd-vault.firebaseapp.com",
  projectId: "improved-dnd-vault",
  storageBucket: "improved-dnd-vault.firebasestorage.app",
  messagingSenderId: "629170727872",
  appId: "1:629170727872:web:41106feccd0c383b5df625",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
