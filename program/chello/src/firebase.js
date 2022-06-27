// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {} from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDnk4L0gxjksYThnF5MZbFuUYJBNa9PflE",
//   authDomain: "tpagh-2532c.firebaseapp.com",
//   projectId: "tpagh-2532c",
//   storageBucket: "tpagh-2532c.appspot.com",
//   messagingSenderId: "525477093995",
//   appId: "1:525477093995:web:04579406f30b50dcaec72e"
// };

const firebaseConfig = {
  apiKey: "AIzaSyADDbxSWdwZX44g0KLmA2NGsI1cvyT1uOs",
  authDomain: "chello-e7692.firebaseapp.com",
  projectId: "chello-e7692",
  storageBucket: "chello-e7692.appspot.com",
  messagingSenderId: "962079026535",
  appId: "1:962079026535:web:c6e623eb653d9c44be93c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app)
