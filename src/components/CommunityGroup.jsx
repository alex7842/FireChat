import React, { useEffect, useState } from 'react'
import Typography from 'antd/es/typography/Typography'
import GroupContext from './context/GroupContext'
import { useContext } from 'react'
import { Flex} from 'antd';
import { doc,collection,getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import UserContext from './context/context'
export const CommunityGroup = () => {
  const {setgroup,isgroup,setgroupid,setgroupname,setgrouplogo}=useContext(GroupContext)
  const { user } = useContext(UserContext);
  const usergroup = collection(db, "Groupusers");
  const [grpmessage,setgrpmessage]=useState([]);
 useEffect(()=>{
  const fetchUsers = async () => {
    try {
   
      const querySnapshot = await getDocs(usergroup);
      const usersList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
      
    setgrpmessage(usersList);
    console.log("grpeasge",grpmessage)
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };
 fetchUsers();

  
 },[isgroup])


  return (
    <div>
       <br/>
  
        <Typography.Text style={{fontSize:22,color:'blue',cursor:'pointer'}} onClick={() =>setgroup('allowchat')}>Community Chat 📢</Typography.Text>
        <br/>
        <Typography.Text>GROUPS</Typography.Text>

        <br/>
        {grpmessage
  .filter(user1 => user1.members.includes(user.displayName))
  .map((user1, i) => (
    <Flex key={i} gap={7}>
      <img
        onClick={() => {
          setgroup("group");
          setgroupid(user1.id);
          setgroupname(user1.groupname);
          setgrouplogo(user1.logo);
          console.log("selected id:", user1.id);
        }}
        className='userimg'
        src={user1.logo}
        alt={user1.groupname}
      />
      <p>{user1.groupname.charAt(0).toUpperCase() + user1.groupname.slice(1)}</p>
    </Flex>
  ))}

        </div>
  )
}
