// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBl0VK67Mumf17QzoJIIZ_GMyDK5jGMo6Q",
    authDomain: "inventory-management-e694c.firebaseapp.com",
    projectId: "inventory-management-e694c",
    storageBucket: "inventory-management-e694c.appspot.com",
    messagingSenderId: "474925511935",
    appId: "1:474925511935:web:7cf35de0948e723c0b48ca",
    measurementId: "G-G74DQ268JY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }