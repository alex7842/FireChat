import { useState,useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup } from 'firebase/auth'
import {auth,provider } from './config/firebase'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection,query, where, getDocs, setDoc,doc} from 'firebase/firestore';
import { Link,useNavigate } from "react-router-dom";
import { Home } from './components/Home';
import {db} from './config/firebase'
import UserContext from './components/context/context';
import ChatContext from './components/context/ChatContext';
import { registerForPushNotifications } from './utils/fcmUtils';
import { Hero } from './components/Design/Hero';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"
function App() {
  const { user, setuser } = useContext(UserContext);
  
 
  return (
    <div>
      {(user &&  localStorage.getItem("isloggedin")==="true") ?(
        <>
        <Home/>
        <SpeedInsights />
        <Analytics />
        </>
      ) :  <Hero/>
    }
    </div>
  );
}


export default App
