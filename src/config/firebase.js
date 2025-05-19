import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration from your backend .env file
const firebaseConfig = {
  apiKey: "AIzaSyAQAGsscAon3ybycSwXOWdZ-Qo704BX29k",
  authDomain: "url-shortener-app-8d32a.firebaseapp.com",
  projectId: "url-shortener-app-8d32a",
  storageBucket: "url-shortener-app-8d32a.firebasestorage.app",
  messagingSenderId: "740987283799",
  appId: "1:740987283799:web:ec6cb4dc69195af908f612",
  measurementId: "G-D1WQ6JSLB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
