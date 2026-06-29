import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyCIS9Cxw21yjsfVAX47lRibuHBsazBzIlY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    "improved-dnd-vault.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "improved-dnd-vault",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    "improved-dnd-vault.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "629170727872",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    "1:629170727872:web:41106feccd0c383b5df625",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
