// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjuVT8rCH8dMAOUO8rmpm7hUfDeiMrdqY",
  authDomain: "web-app-50f58.firebaseapp.com",
  projectId: "web-app-50f58",
  storageBucket: "web-app-50f58.appspot.com",
  messagingSenderId: "310396170716",
  appId: "1:310396170716:web:d0abe09d8411593f2b9f19",
  measurementId: "G-P7BVRWFGJW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const databaseURL = "https://web-app-50f58-default-rtdb.europe-west1.firebasedatabase.app";
const database = getDatabase(app, databaseURL);
const analytics = getAnalytics(app);

export {auth, database}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import dotenv from 'dotenv';

// dotenv.config();

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MESUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = app.auth();
// const database = app.database();
// const analytics = getAnalytics(app);

// export {auth, database};