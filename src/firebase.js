import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBomwBWqgXIrzVVJ7L9W058WSUgkJcP1CE",
    authDomain: "instagram-demo-f2e72.firebaseapp.com",
    projectId: "instagram-demo-f2e72",
    storageBucket: "instagram-demo-f2e72.appspot.com",
    messagingSenderId: "1044574215590",
    appId: "1:1044574215590:web:b3829dbae174eab2f64367",
    measurementId: "G-FTGBMFHJR2"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };