import React, { useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { collection, addDoc, doc, getDocs, query, where, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import ChatContext from './context/ChatContext'

export const Follow = () => {
  const { UserId } = useContext(ChatContext)
  const [track, settrack] = useState("Follow")

  useEffect(() => {
    const checkStatus = async () => {
      const docRef = doc(db, "chatusers", UserId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists() && docSnap.data().status === "RequestSent") {
        settrack("Request Sent")
      } else {
        settrack("Follow")
      }
    }
    
    checkStatus()
  }, [UserId])

  const handlefollow = async () => {
    const docRef = doc(db, "chatusers", UserId)
    await updateDoc(docRef, {
      isfollowing: "no",
      status: "RequestSent"
    })
    settrack("Request Sent")
  }

  return (
    <button 
      onClick={handlefollow}
      className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md flex items-center space-x-2'
    >
      {track}
    </button>
  )
}
