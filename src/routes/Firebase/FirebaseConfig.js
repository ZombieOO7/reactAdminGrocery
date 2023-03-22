import firebase from "firebase";
import "firebase/messaging";

// FIREBASE CONFIGURATIONS
const config = {
  apiKey: "AIzaSyBylKo-vBtO0PeluEtLoBEs0bZgHhUAeA8",
  authDomain: "pmisf-2c3e0.firebaseapp.com",
  projectId: "pmisf-2c3e0",
  storageBucket: "pmisf-2c3e0.appspot.com",
  messagingSenderId: "224316119767",
  appId: "1:224316119767:web:ca0a6afbe35f4ea5cb2e92",
  measurementId: "G-L73YL8SWDF",
  databaseURL: "https://pmisf-2c3e0-default-rtdb.firebaseio.com",
};

// FIREBASE INITIALIZATIONS
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true,
});

// FIREBASE CONFIGURATIONS
export const myFirebase = firebase;
export const myFirestore = firebase.firestore();
export const myStorage = firebase.storage();

// FIREBASE MESSAGING

if (firebase.messaging.isSupported()) {
  var messaging = firebase.messaging();
}

const { REACT_APP_VAPID_KEY } =
  "AAAANDpIWtc:APA91bEcSCw65Qj6yw0xgg7uNvhhnHtgvWST6H8p5YC3p11Wv7VbJeS5yNZbBAtjv7XBuTkOOIsOLiFi0saTTkS6pkaSUuKPVAgxevE4l2ezPZT_zZ1ZalCx512cdcvo1Z8HVzVKsT_J";
const publicKey = REACT_APP_VAPID_KEY;

export const getToken = async (setTokenFound) => {
  let currentToken = "";
  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {}
  return currentToken;
};
