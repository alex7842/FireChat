import React, {useContext,useState,useEffect}from 'react'
import {LoadingOutlined } from '@ant-design/icons';
import { getDocs,collection} from 'firebase/firestore';
import { Avatar, Divider, Tooltip } from 'antd';
import UserContext from './context/context';
import {db } from '../config/firebase'
import GroupContext from './context/GroupContext';




export const Group = () => {
  const { user } = useContext(UserContext);
  // const [users, setUsers] = useState([]);
  const {users,setUsers} =useContext(GroupContext)
  // const [loading, setLoading] = useState(false);
  // const messageref=collection(db,"users")
  // const {setgroup}=useContext(GroupContext)

  return (
    <div>
 {users.length > 0 ? (

      <Avatar.Group  
        max={{
          count: 2,
          style: { color: '#f56a00', backgroundColor: '#fde3cf' },
        }}
      >
        <Avatar    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        {users.map((i) => (
          <Tooltip key={i.id} title={i.displayName} placement="top">
            <Avatar style={{cursor:'pointer'}}src={i.photoURL} />
          </Tooltip>
        ))}
      </Avatar.Group>
    ) : (
      <LoadingOutlined style={{ color: '#00ccff', fontSize: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    )}


    
    </div>

  )
}
