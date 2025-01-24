import React, { useEffect, useState,useContext, useRef } from 'react'
import {db } from '../config/firebase'
import { getDocs, collection,query,where,doc,getDoc,arrayRemove,updateDoc } from 'firebase/firestore';
import { Flex } from 'antd';
import { LoadingOutlined,  SearchOutlined,MessageOutlined} from '@ant-design/icons';
import { Spin,Input,Image,Badge } from 'antd';
import UserContext from './context/context';
import ChatContext, { useChat } from './context/ChatContext';
import GroupContext from './context/GroupContext';
export const UserList = ({ onUserSelect }) => {

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
  //  console.log("oppositr user id",id);
    // Remove clicked user's ID from newMessages array using arrayRemove
    await updateDoc(currentUserRef, {
        newMessages: arrayRemove(id)
    });
    if (onUserSelect) {
      onUserSelect({ uid: id, displayName: name, photoURL: img, email });
    }

    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(messageref);
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user1 => user1.uid !== user.uid && user1.valid !== false)
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
  }, [user.uid]);



  const handleSearch = (e) => {
    const searchValue = e.target.value;
    handlevalue(searchValue);
  };

 const handlevalue = async (v) => {

  //console.log(v)
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
   //   console.log(data)
      setUsers(data);
    } else {
      const querySnapshot = await getDocs(collection(db, "users"));
      const allUsers = querySnapshot.docs
      .map(doc => doc.data())
      .filter(userData => userData.uid !== user.uid);
    
    setUsers(allUsers);
    
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
  function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
  
  
  return (
<div className="users-container p-4 h-full overflow-y-auto touch-pan-y -webkit-overflow-scrolling-touch  md:border-gray-200 ">

  {/* Centered Search Container */}
  <div className="max-w-xl mx-auto mb-6">
    <div className="relative group">
      <input
        type="search"
        ref={inp}
        id="input"
        className="w-full h-12 pl-12 pr-4 
                 rounded-lg border-2 
                 bg-gradient-to-r from-blue-50 to-purple-50
                 border-gray-200 
                 focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                 transition-all duration-300
                 text-base placeholder-gray-400
                 group-hover:border-blue-300 group-hover:shadow-md"
                 onChange={handleSearch}
        placeholder="Search users..."
      />
      <span 
        className="absolute left-4 top-1/2 -translate-y-1/2
                   text-blue-500 group-hover:text-purple-500
                   transition-colors duration-300 cursor-pointer"
        onClick={() => inp.current.focus()}
      >
        <SearchOutlined className="text-lg" />
      </span>
    </div>
  </div>

  {/* Centered Loader */}
  {loading ? (
    <div className="flex justify-center items-center h-40">
      <Spin 
        indicator={
          <LoadingOutlined 
            style={{ fontSize: 28 }} 
            className="text-blue-500" 
            spin 
          />
        } 
      />
    </div>
  ) : users.length > 0 ? (
    <ul className="space-y-2">
      {users.map(user1 => {
        const userIsActive = isActive(user1);
        const hasNewMessage = user?.newMessages?.includes(user1.uid);
        const lastActive = user1.lastactive?.toDate();
  const timeAgo = lastActive ? formatTimeAgo(lastActive) : 'Never';

        return (
          <div className=''>
          <li
            key={user1.id}
            className="user-item p-3 rounded-lg 
                     hover:bg-blue-50 hover:border-blue-200
                     transition-all cursor-pointer 
                     border border-gray-200 "
            onClick={() => handleid(user1.uid, user1.displayName, user1.photoURL, user1.email)}
          >
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={8}>
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full object-cover 
                             border-2 border-gray-200
                             hover:border-blue-300 transition-colors"
                    src={user1.photoURL}
                    alt={user1.displayName}
                  />
                  {userIsActive && (
                    <span className="absolute bottom-0 right-0 
                                   w-3 h-3 bg-green-500 
                                   border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}
                  </p>
                  {userIsActive ? (
                <span className="text-xs text-green-600">Active now</span>
              ) : (
                <span className="text-xs text-gray-500">Last seen {timeAgo}</span>
              )}
                </div>
              </Flex>
              {hasNewMessage && (
                <Badge count={<MessageOutlined  className='text-violet-500 text-xl' />} />
              )}
            </Flex>
          </li>
          </div>
        );
      })}
    </ul>
  ) : (
    <p className="text-center text-gray-500">No users found</p>
  )}
</div>

  );
  
}
