import React, { useEffect, useState,useContext, useRef } from 'react'
import {db } from '../config/firebase'
import { getDocs, collection,query,where } from 'firebase/firestore';
import { Flex } from 'antd';
import { LoadingOutlined,  SearchOutlined} from '@ant-design/icons';
import { Spin,Input,Image } from 'antd';
import UserContext from './context/context';
import { useChat } from './context/ChatContext';
import GroupContext from './context/GroupContext';
export const UserList = () => {

  const { user } = useContext(UserContext);
  const {users,setUsers,text}=useContext(GroupContext)
 
  const { createPersonalChat } = useChat();
  
  const inp=useRef();
    const [loading, setLoading] = useState(false);
  
    const [value,setvalue] = useState('');
  
    const messageref=collection(db,"users")
   
    


    function handleid(id,name,img,email){
    createPersonalChat(id+user.uid,name,img,email)

    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(messageref);
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user1 => user1.uid !== user.uid);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      finally{
        setLoading(false);
      }
    };

  useEffect(() => {

    fetchUsers();
  }, [text]);

  useEffect(() => {
    if(!users.length){
      fetchUsers();
    }
  })



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
    <div>
      <br></br>
   <div className="search-container">
    <input
      type="search"
      ref={inp}
      id="input"
      className="search-input"
      onChange={()=>handlevalue(document.getElementById('input').value)}
    />
    <span class="search-icon" onClick={()=>inp.current.focus()}>
      <SearchOutlined/>
    </span>
  </div>
  <br></br>
  
      {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}/>
      ) : users.length > 0 ? (
        <ul>
{users.map(user1 => {
  const userIsActive = isActive(user1);
  
  return (
    <Flex key={user1.id} gap={1} align="center" justify="space-between" onClick={() => handleid(user1.uid, user1.displayName, user1.photoURL, user1.email)}>
      <Flex align="center" gap={7}>
        <div style={{ position: 'relative' }}>
          <img className='userimg' src={user1.photoURL} alt={user1.displayName} />
          {userIsActive && (
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: '8px',
                height: '8px',
                backgroundColor: '#44b700',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px #fff',
              }}
            />
          )}
        </div>
        <p>{user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}</p>
      </Flex>
      {userIsActive && (
        <span style={{ fontSize: '0.8em', color: '#44b700' }}>Active</span>
      )}
    </Flex>
  );
})}


        </ul>
      ) : (
        <p></p>
      )}
    </div>
  );
  
}
