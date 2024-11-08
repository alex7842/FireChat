import React from 'react'
import { useState,useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup } from 'firebase/auth'

import { Timestamp } from 'firebase/firestore';
import { addDoc, collection,query, where, getDocs, setDoc,doc} from 'firebase/firestore';
import { Link,useNavigate } from "react-router-dom";
import { db,auth,provider } from '../../config/firebase'
import UserContext from '../context/context';
import ChatContext from '../context/ChatContext';



export const Hero = () => {
    const { user, setuser } = useContext(UserContext);
  const {homereload,sethomereload}=useContext(ChatContext);
  const date = new Date();
  const messageref=collection(db,"users")
  const navigate = useNavigate();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const signin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName.toUpperCase(),
        photoURL: result.user.photoURL,
        lastactive: Timestamp.fromDate(date),
        date
      };
      setuser(userData);
      localStorage.setItem("isloggedin", "true");
      localStorage.removeItem('cachedPosts');
  // Reset counter to 0 instead of incrementing
  sethomereload(0);
      console.log(userData); // Set the correct user object
      // await registerForPushNotifications(userData.uid);
     
      navigate('/Home');
      const userQuery = query(messageref, where("uid", "==", result.user.uid));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        const userDocRef = doc(db, 'users', userData.uid);
        await setDoc(userDocRef, userData);
        console.log("New user document written with UID:", result.user.uid);
      } else {
        console.log("User already exists with UID:", result.user.uid);
      }

    
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <>
    <div>Hello is this your first time here sign up</div>
      <div className='p-5 text-center'>
        <div>
          
        </div>
        <div className='btn btn-primary' style={{marginTop: "50px"}} onClick={signin}>
          Login
        </div>
      </div>
    </>

  )
}
