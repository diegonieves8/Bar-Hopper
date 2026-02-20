import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBd-V5RzQMD5ay3-Q9TN0gQs62u7rHE8w",
  authDomain: "slo-bar-tracker.firebaseapp.com",
  projectId: "slo-bar-tracker",
  storageBucket: "slo-bar-tracker.firebasestorage.app",
  messagingSenderId: "184893733922",
  appId: "1:184893733922:web:bb6274dea64036e8849e7b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
