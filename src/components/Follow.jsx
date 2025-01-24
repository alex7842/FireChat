import { message, Modal } from 'antd';
import React, { useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { PlusCircleIcon,ClockIcon,CheckCircleIcon } from 'lucide-react';
import { collection, addDoc, doc, getDocs, query, where, updateDoc,orderBy,limit,getDoc } from 'firebase/firestore'
import ChatContext from './context/ChatContext'
import UserContext from './context/context'
import { sendNotification } from '../utils/notificationUtils';

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
    const recipientDoc = await getDoc(doc(db, "users", uid1));
    const recipientFcmToken = recipientDoc.data().fcmToken;
    //console.log(" sharing user recipientFcmToken",recipientFcmToken);
    // Send notification
    if (recipientFcmToken) {
      await sendNotification(recipientFcmToken, `${user.displayName}: has sent you a friend request`,user.uid,user.displayName,user.photoURL);
    }
  
  }

  return (
    <button
    onClick={handlefollow}
    className={`
      ${track === "Following" 
        ? 'bg-violet-500 hover:bg-violet-600' 
        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600'
      } 
      text-white font-medium py-1.5 px-4 rounded-full 
      transition-all duration-300 ease-in-out
      shadow-md hover:shadow-lg
      flex items-center justify-center gap-2
      min-w-[120px]
    `}
  >
    {track === "Following" ? (
      <>
        <CheckCircleIcon className="w-4 h-4" />
        <span>Following</span>
      </>
    ) : track === "Request Sent" ? (
      <>
        <ClockIcon className="w-4 h-4 animate-pulse" />
        <span>Requested</span>
      </>
    ) : (
      <>
        <PlusCircleIcon className="w-4 h-4" />
        <span>Follow</span>
      </>
    )}
  </button>
  
  )
}
