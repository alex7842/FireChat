import React, { useContext } from 'react'
import GroupContext from './context/GroupContext'
import { Avatar, Flex } from 'antd'
export const ShowGroup = () => {
    const {users}=useContext(GroupContext)
  return (
    <div className="p-4 space-y-3">
    {users.map(user1 => (
        <Flex 
            key={user1.id} 
            align="center" 
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
            <Avatar 
                src={user1.photoURL} 
                alt={user1.displayName}
                className="w-10 h-10 border-2 border-violet-200" 
            />
            <p className="ml-3 font-medium text-gray-700">
                {user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}
            </p>
        </Flex>
    ))}
</div>
  )
}
