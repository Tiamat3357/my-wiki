import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// กุญแจลับเข้าโกดัง Firebase ของโปรเจกต์ my-wiki-b53b2
const firebaseConfig = {
  apiKey: "AIzaSyDlnsHPUO-anzqbgeGUH9E2TjgKXLRu7f0",
  authDomain: "my-wiki-b53b2.firebaseapp.com",
  projectId: "my-wiki-b53b2",
  storageBucket: "my-wiki-b53b2.firebasestorage.app",
  messagingSenderId: "939490000078",
  appId: "1:939490000078:web:2f5d5003ce8f14fc76a49f"
};

// สั่งให้ระบบ Firebase เริ่มทำงาน
const app = initializeApp(firebaseConfig);

// สร้างและส่งออกท่อเชื่อม Database (db) เพื่อให้ App.vue เอาไปใช้
export const db = getFirestore(app);
