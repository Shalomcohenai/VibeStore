// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpzqQ4eKeLej8BeN2ly7lOspkx5nnEttE",
  authDomain: "vibestore-7af1e.firebaseapp.com",
  projectId: "vibestore-7af1e",
  storageBucket: "vibestore-7af1e.firebasestorage.app",
  messagingSenderId: "282481643143",
  appId: "1:282481643143:web:a7ab34bfe49766eec43222",
  measurementId: "G-59FYNPQGEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);