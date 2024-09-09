// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';
import UserContext from './context';
import { doc,collection,addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [group, setgroup] = useState('message');
  const {user}=useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [isgroup,setisgroup]=useState(false);
  const [groupid,setgroupid]=useState("")
  const [groupname,setgroupname]=useState("")
  const [grouplogo,setgrouplogo]=useState("")
  const [groupdescription,setgroupdescription]=useState("")
  const [admin,setadmin]=useState("")
  const [isopen,setisopen]=useState(false)
 const [draw,setdraw]=useState(false)
  return (
    <GroupContext.Provider value={{ group,setgroup,users,setUsers,setisgroup,isgroup,groupid,setgroupid,setgroupname,setgrouplogo,setadmin,setgroupdescription,groupname,grouplogo,groupdescription,admin,setisopen,setdraw,draw }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
