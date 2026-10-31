// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-56c3d.firebaseapp.com",
  projectId: "mern-estate-56c3d",
  storageBucket: "mern-estate-56c3d.firebasestorage.app",
  messagingSenderId: "1014944756522",
  appId: "1:1014944756522:web:3bae3cb032dd6401be6453"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);