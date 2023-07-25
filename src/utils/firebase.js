import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// TODO: switch to modular v9
// https://firebase.google.com/docs/auth/web/start?authuser=0
// https://firebase.google.com/docs/web/modular-upgrade

var firebaseConfig = {
  // config here
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURE_ID,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
