// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRDoHzOTaeVZ_pD28TrabTwGOlPjeJdP0",
  authDomain: "bankdatabase-2791f.firebaseapp.com",
  projectId: "bankdatabase-2791f",
  storageBucket: "bankdatabase-2791f.appspot.com",
  messagingSenderId: "1098875991756",
  appId: "1:1098875991756:web:93d8fcdd6753d695007469",
  measurementId: "G-BFZ2EYKR9R"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, doc, setDoc,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,fetchSignInMethodsForEmail };