// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDngrj7nP_x-8Y55NdJPz7h-VVOh8Cbyu4",
  authDomain: "flashwords-3a452.firebaseapp.com",
  projectId: "flashwords-3a452",
  storageBucket: "flashwords-3a452.appspot.com",
  messagingSenderId: "285423195509",
  appId: "1:285423195509:web:fd9b0317553cb462bbaf3c",
  measurementId: "G-1FR9F2WYZ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
