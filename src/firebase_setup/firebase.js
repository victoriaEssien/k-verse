// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPdOpsjlUOSr4FfG_kfH4CbcWvMFHHRHg",
  authDomain: "k-verse-7e64e.firebaseapp.com",
  projectId: "k-verse-7e64e",
  storageBucket: "gs://k-verse-7e64e.appspot.com",
  messagingSenderId: "306608393352",
  appId: "1:306608393352:web:00a68d38948e944f9da33d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }