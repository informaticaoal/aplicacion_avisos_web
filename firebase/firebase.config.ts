// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAoRj-Q5bXO-bpSVqjRavoH6m_LOOasRCk",
  authDomain: "avisos-app-365a4.firebaseapp.com",
  projectId: "avisos-app-365a4",
  storageBucket: "avisos-app-365a4.firebasestorage.app",
  messagingSenderId: "963075743182",
  appId: "1:963075743182:web:1bc0515a466e70e6605f9f",
  measurementId: "G-K6JQ0VX100"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };