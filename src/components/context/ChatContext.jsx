import React, { createContext, useContext, useState } from 'react';
import { db } from '../../config/firebase';
import { getDocs, collection,setDoc,doc,query,where} from 'firebase/firestore';
import UserContext from './context';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [personalChats, setPersonalChats] = useState('');
  const [cname,setcname]=useState('');
  const [UserId,setUserId]=useState('')
  const [cimg,setcimg]=useState('');
  const [page,setpage]=useState('0');
  
  const [cemail,setcemail]=useState('');

  const { user } = useContext(UserContext);
  const createPersonalChat = async (joinedid,name,img,email) => {
    const userId=joinedid.split("").sort().join("");
    console.log("from context ",userId,name,img,email)
    setcname(name)
    setUserId(userId)
    setcimg(img)
    setcemail(email)
    // console.log("sorted user id is:",userId)


    const userDocRef = collection(db,"chatusers");
   
    const q = query(userDocRef, where("id", "==", userId));
    const querySnapshot = await getDocs(q);
  
    const chatList = querySnapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
    if (chatList.length > 0) {
    setPersonalChats(userId); 
  } else {
   
    const docRef =doc(db, "chatusers", userId);
   
  
    await setDoc(docRef, {uid:user.uid,name:user.displayName});
    
    setPersonalChats(userId);
    console.log('rommid from chatcontext:',userId)
    localStorage.setItem('chatrommid',userId) 
  }
  //  console.log(chatList)
  //   console.log("joined and sorted id is",userId)
   
  };

  return (
    <ChatContext.Provider value={{ personalChats,setPersonalChats, createPersonalChat,cname,cimg,cemail,UserId,page,setpage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatContext;
