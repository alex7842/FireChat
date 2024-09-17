import React,{useEffect} from 'react'
import { doc,updateDoc,Timestamp } from 'firebase/firestore';
import { useContext } from 'react';
import UserContext from './context/context';

import { Signin } from './Signin';
import HomeIntro from './HomeIntro';

import { db } from '../config/firebase';
import GroupContext from './context/GroupContext';

export const Home = () => {
  const { user } = useContext(UserContext);
 const{test}=useContext(GroupContext)
    console.log("from home",user);
    const date = new Date();
    const updateLastActive = async () => {
      if (user && user.uid) {
        const userRef = doc(db, 'users', user.uid);
        const date = new Date();
        try {
          await updateDoc(userRef, {
            lastactive: Timestamp.fromDate(date),
           
          });
          console.log('Last active status updated successfully');
        } catch (error) {
          console.error('Error updating last active status:', error);
        }
      }
    };
  
    useEffect(() => {
      if (user) {
        updateLastActive();
        const interval = setInterval(updateLastActive, 200000); // Update every minute
  
        const handleVisibilityChange = () => {
          if (document.hidden) {
            updateLastActive();
          }
        };
  
        document.addEventListener('visibilitychange', handleVisibilityChange);
  
        return () => {
          clearInterval(interval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    }, [user,test]);
  return (
    <>
    {
user ?
<>
   <HomeIntro/>
   </>
  
  
    :<Signin/>
}
    </>

  )
}
