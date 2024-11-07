import React, { useEffect, useState,useContext, useRef } from 'react'
import {db } from '../config/firebase'
import { getDocs, collection,query,where,doc,getDoc,arrayRemove,updateDoc } from 'firebase/firestore';
import { Flex } from 'antd';
import { LoadingOutlined,  SearchOutlined,MessageOutlined} from '@ant-design/icons';
import { Spin,Input,Image,Badge } from 'antd';
import UserContext from './context/context';
import ChatContext, { useChat } from './context/ChatContext';
import GroupContext from './context/GroupContext';
export const UserList = () => {

  const { user} = useContext(UserContext);
  const{targetuserid,settargetuserid}=useContext(ChatContext)
  const {users,setUsers,loading, setLoading}=useContext(GroupContext)
  const [usersWithNewMsg, setUsersWithNewMsg] = useState({});

  const { createPersonalChat } = useChat();
  
  const inp=useRef();
    
  
    const [value,setvalue] = useState('');
  
    const messageref=collection(db,"users")
   
    
   
  

    async function handleid(id,name,img,email){
     
      settargetuserid(id);
    createPersonalChat(id+user.uid,name,img,email)
    const currentUserRef = doc(db, "users", user.uid);
    console.log("oppositr user id",id);
    // Remove clicked user's ID from newMessages array using arrayRemove
    await updateDoc(currentUserRef, {
        newMessages: arrayRemove(id)
    });
   

    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(messageref);
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user1 => user1.uid !== user.uid)
          .sort((a, b) => {
            // Handle cases where lastactive might be undefined
            if (!a.lastactive) return 1;
            if (!b.lastactive) return -1;
            // Sort in descending order (most recent first)
            return b.lastactive.toDate() - a.lastactive.toDate();
          });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };
    

  useEffect(() => {

   fetchUsers();
  }, []);





 const handlevalue = async (v) => {

  console.log(v)
    if (v) {
      const startLetter = v.toUpperCase();
      const endLetter = startLetter + '\uf8ff'; 
      const q = query(
        collection(db, 'users'),
        where('displayName', '>=', startLetter),
        where('displayName', '<', endLetter)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      console.log(data)
      setUsers(data);
    } else {
      setUsers([]);
    }
  };
  const isActive = (user1) => {
    if (!user1.lastactive) return false;
    
    const now = new Date();
    
    const lastActiveDate = user1.lastactive.toDate();
    
    // Check if last active was today
    const isToday = lastActiveDate.toDateString() === now.toDateString();
    
    // Check if last active was within the last 2 minutes
    const twoMinutesAgo = now.getTime() - 200000;
    
    const isWithinTwoMinutes = lastActiveDate.getTime() > twoMinutesAgo;
  
    // User is active if they were active today AND within the last 2 minutes
    return isToday && isWithinTwoMinutes;
  };
  
  return (
    <div className="users-container p-4">
      <div className="search-container mb-4">
        <input
          type="search"
          ref={inp}
          id="input"
          className="search-input w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          onChange={() => handlevalue(document.getElementById('input').value)}
          placeholder="Search users..."
        />
        <span className="search-icon" onClick={() => inp.current.focus()}>
          <SearchOutlined />
        </span>
      </div>
  
      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : users.length > 0 ? (
        <ul className="space-y-3">
          {users.map(user1 => {
            const userIsActive = isActive(user1);
            const hasNewMessage = user?.newMessages?.includes(user1.uid);
  
            return (
              <li 
                key={user1.id} 
                className="user-item p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer shadow-md"
                onClick={() => handleid(user1.uid, user1.displayName, user1.photoURL, user1.email)}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={12}>
                    <div className="relative">
                      <img 
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                        src={user1.photoURL} 
                        alt={user1.displayName} 
                      />
                      {userIsActive && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}
                      </p>
                      {userIsActive && (
                        <span className="text-sm text-green-600">Active now</span>
                      )}
                    </div>
                  </Flex>
                  {hasNewMessage && (
                    <Badge count={<MessageOutlined style={{ color: '#1890ff' }} />} />
                  )}
                </Flex>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
  
}
