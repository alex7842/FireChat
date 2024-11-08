import { Button, Flex, Typography,notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Signin = () => {

    const [pause,setpause]=useState(true)
    const [api, contextHolder] = notification.useNotification();
    useEffect(()=>{
        api.open({
            message: 'Notification Title',
            description:
              'Please Login to your account',
            showProgress: true,
            pause,
          });
    },[])
      
   
    const navigate = useNavigate();

    const handleclick=()=>{
       navigate("/")
    }
  return (
    <>
     {contextHolder}
     <div className='flexdiv'>
    <Flex   vertical align='center' >
    <p>You are not logged in</p>
    <p>Please sign in to use <bold>ChatApp</bold>  😄</p>
    <Button type='primary' onClick={handleclick}>Log in</Button>
    </Flex>
    </div>
    </>
  )
}
