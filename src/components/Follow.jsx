import { message, Modal } from 'antd';
import React, { useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { collection, addDoc, doc, getDocs, query, where, updateDoc,orderBy,limit } from 'firebase/firestore'
import ChatContext from './context/ChatContext'
import UserContext from './context/context'

export const Follow = ({uid1,username1,userurl1}) => {
  const { UserId } = useContext(ChatContext)
  const {user} = useContext(UserContext);
  const [track, settrack] = useState("Follow")

  useEffect(() => {
    const checkRequestStatus = async () => {
      const notificationRef = collection(db, "users", uid1, "notifications");
      const q = query(
        notificationRef, 
        where("senderId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      
      await getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestNotification = querySnapshot.docs[0].data();
          if (latestNotification.status === "accepted") {
            settrack("Following");
          } else if (latestNotification.status === "pending") {
            settrack("Request Sent");
          } else {
            settrack("Follow");
          }
        }
      });
    };
    
    
    checkRequestStatus();
  }, [uid1, user.uid]);

  const handleUnfollow = async () => {
    Modal.confirm({
      title: 'Unfollow Confirmation',
      content: `Are you sure you want to unfollow ${username1}?`,
      okText: 'Yes, Unfollow',
      cancelText: 'No, Keep Following',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        const notificationRef = collection(db, "users", uid1, "notifications");
        const q = query(notificationRef, where("senderId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (document) => {
          const docRef = doc(db, "users", uid1, "notifications", document.id);
          await updateDoc(docRef, {
            status: "unfollowed",
            message: `${user.displayName} unfollowed you`
          });
        });
        
        settrack("Follow");
      }
    });
  };

  const handlefollow = async () => {
    if (track === "Following") {
      handleUnfollow();
      return;
    }

    const notificationRef = collection(db, "users", uid1, "notifications");
    
    await addDoc(notificationRef, {
        type: "friend_request",
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        status: "pending",
        timestamp: new Date(),
        message: `${user.displayName} sent you a friend request`
    });
    
    settrack("Request Sent")
  }

  return (
    <button 
      onClick={handlefollow}
      className={`${track === "Following" ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md flex items-center space-x-2`}
    >
      {track}
    </button>
  )
}
