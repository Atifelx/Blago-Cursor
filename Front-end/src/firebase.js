// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mean-blago.firebaseapp.com",
  projectId: "mean-blago",
  storageBucket: "mean-blago.appspot.com",
  messagingSenderId: "603981101638",
  appId: "1:603981101638:web:adb2ff37afefc8bff12847",
  measurementId: "G-C96SJFYNMK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);