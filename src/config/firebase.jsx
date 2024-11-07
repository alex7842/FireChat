// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCaofRnxuQW5sO9v5ROVbOWQokxX7fpDA",
  authDomain: "chatapp-81c34.firebaseapp.com",
  projectId: "chatapp-81c34",
  storageBucket: "chatapp-81c34.appspot.com",
  messagingSenderId: "496298935969",
  appId: "1:496298935969:web:d17d72db8d8af8e20f52e0"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBbThrGm0hd6vvYxVTVmU85MwQug_6RNpQ",
//   authDomain: "chatapp-demo-e7682.firebaseapp.com",
//   projectId: "chatapp-demo-e7682",
//   storageBucket: "chatapp-demo-e7682.firebasestorage.app",
//   messagingSenderId: "568544912762",
//   appId: "1:568544912762:web:d0d7c7f75bf94f447422c3",
//   measurementId: "G-8ZZMYEPMBG"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
export const messaging = getMessaging(app);
