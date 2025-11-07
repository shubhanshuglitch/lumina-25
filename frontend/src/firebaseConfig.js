// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFs1pbKHOC0SjH5CUN4JaxFRTdSvjxndk",
  authDomain: "smart-campus-9bce4.firebaseapp.com",
  projectId: "smart-campus-9bce4",
  storageBucket: "smart-campus-9bce4.firebasestorage.app",
  messagingSenderId: "448386718697",
  appId: "1:448386718697:web:b10af75fd848719cf80978",
  measurementId: "G-CXB7601XNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);