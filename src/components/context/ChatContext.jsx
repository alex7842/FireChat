import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { getDocs, collection, setDoc, doc, query, where } from 'firebase/firestore';
import UserContext from './context';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [personalChats, setPersonalChats] = useState(() => localStorage.getItem('personalChats') || '');
  const [cname, setcname] = useState(() => localStorage.getItem('cname') || '');
  const [UserId, setUserId] = useState(() => localStorage.getItem('UserId') || '');
  const [cimg, setcimg] = useState(() => localStorage.getItem('cimg') || '');
  const [page, setpage] = useState(() => localStorage.getItem('page') || '0');
  const [cemail, setcemail] = useState(() => localStorage.getItem('cemail') || '');

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (personalChats) localStorage.setItem('personalChats', personalChats);
    if (cname) localStorage.setItem('cname', cname);
    if (UserId) localStorage.setItem('UserId', UserId);
    if (cimg) localStorage.setItem('cimg', cimg);
    if (page) localStorage.setItem('page', page);
    if (cemail) localStorage.setItem('cemail', cemail);
  }, [personalChats]);

  const createPersonalChat = async (joinedid, name, img, email) => {
    const userId = joinedid.split("").sort().join("");
    console.log("from context ", userId, name, img, email);

    setcname(name);
    setUserId(userId);
    setcimg(img);
    setcemail(email);

    const userDocRef = collection(db, "chatusers");
    const q = query(userDocRef, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    const chatList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (chatList.length > 0) {
      setPersonalChats(userId);
    } else {
      const docRef = doc(db, "chatusers", userId);
      await setDoc(docRef, { uid: user.uid, name: user.displayName });
      setPersonalChats(userId);
      console.log('rommid from chatcontext:', userId);
    }
  };

  return (
    <ChatContext.Provider value={{ personalChats, setPersonalChats, createPersonalChat, cname, cimg, cemail, UserId, page, setpage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatContext;
