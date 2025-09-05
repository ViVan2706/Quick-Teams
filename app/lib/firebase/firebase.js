// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCehbn5_qN4iljD57btVR95O0hVhb5eNR4",
  authDomain: "quickteams-bc3f9.firebaseapp.com",
  projectId: "quickteams-bc3f9",
  storageBucket: "quickteams-bc3f9.firebasestorage.app",
  messagingSenderId: "362524214339",
  appId: "1:362524214339:web:5409bb8320b3e01d6d00f6",
  measurementId: "G-ED2HGWKEJK"
};

// Initialize Firebase
const app =!getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };