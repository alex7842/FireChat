import React, { useContext } from 'react'
import GroupContext from './context/GroupContext'
import { Avatar, Flex } from 'antd'
export const ShowGroup = () => {
    const {users}=useContext(GroupContext)
  return (
    <div>
        {users.map(user1 => (
            <Flex key={user1.id} gap={7} >
              <Avatar className='userimg' src={user1.photoURL}  alt={user1.displayName} style={{width:'10%',height:'10%'}} />
              <p>{user1.displayName.charAt(0).toUpperCase()+user1.displayName.slice(1)}</p>
            </Flex>
          ))}
    </div>
  )
}
