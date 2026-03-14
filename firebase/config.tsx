import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDctCGO-c9x7RBk72E1oBJM2ggHfRX69qY",
  authDomain: "cyno2026-5a26c.firebaseapp.com",
  projectId: "cyno2026-5a26c",
  storageBucket: "cyno2026-5a26c.firebasestorage.app",
  messagingSenderId: "792682169497",
  appId: "1:792682169497:web:8702688322d1c7c3ada408",
  measurementId: "G-WB6M2J0V2F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);

export { db };
