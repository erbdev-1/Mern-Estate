// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-af309.firebaseapp.com",
  projectId: "mern-estate-af309",
  storageBucket: "mern-estate-af309.appspot.com",
  messagingSenderId: "335558962042",
  appId: "1:335558962042:web:52e750c74a48115ea844c3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
