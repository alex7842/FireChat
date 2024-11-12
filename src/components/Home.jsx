import React,{useEffect} from 'react'
import { doc,updateDoc,Timestamp,getDocs,collection } from 'firebase/firestore';
import { useContext } from 'react';
import UserContext from './context/context';

import { Signin } from './Signin';
import HomeIntro from './HomeIntro';

import { db } from '../config/firebase';
import GroupContext from './context/GroupContext';
import App from '../App';
import ChatContext from './context/ChatContext';

export const Home = () => {
  const { user,globaltrigger,setglobaltrigger } = useContext(UserContext);
  const {sethomereload,homereload}=useContext(ChatContext);
  
  const messageref=collection(db,"users")
   
 const{test,users,loading, setLoading,setUsers,suggestedUsers,setsuggestedUsers}=useContext(GroupContext)
   // console.log("from home",user);
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(messageref);
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user1 => user1.uid !== user.uid);
          const shuffledUsers = usersList.sort(() => 0.5 - Math.random());
          const randomThreeUsers = shuffledUsers.slice(0, 3);
          
          setsuggestedUsers(randomThreeUsers);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      finally{
        setLoading(false);
      }
    };

    useEffect(()=>{
      localStorage.removeItem('cachedPosts');
      // Reset counter to 0 instead of incrementing
      sethomereload(0);
      fetchUsers();
    },[])
    // useEffect(() => {
    //   if (user) {
    //     updateLastActive();
    //     let lastUpdate = Date.now();
    
    //     const handleVisibilityChange = () => {
    //       const currentTime = Date.now();
    //       // Check if 3 minutes (180000ms) have passed since last update
    //       if (!document.hidden && currentTime - lastUpdate >= 180000) {
    //         updateLastActive();
    //         console.log('Last active in home');
    //         lastUpdate = currentTime;
    //       }
    //     };
    
    //     document.addEventListener('visibilitychange', handleVisibilityChange);
    
    //     return () => {
    //       document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    //   }
    // }, [user, test]);
    
    useEffect(() => {
      if (user) {
        let lastUpdate = localStorage.getItem('lastActiveUpdate') || 0;
        const currentTime = Date.now();
        const THREE_MINUTES = 1 * 60 * 1000;
      
        if (currentTime - lastUpdate >= THREE_MINUTES) {
          console.log("lastupdate",lastUpdate,currentTime)
          updateLastActive();
          localStorage.setItem('lastActiveUpdate', currentTime);
        }
      }
    }, [user, test, globaltrigger]);
    
    
  return (
    <>
    {
 (user) ?
<>
   <HomeIntro/>
   </>
  
  
    :<Signin/>
}
    </>

  )
}
