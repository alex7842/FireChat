import React, { useContext } from 'react'
import { useState } from 'react';
import { Avatar, Button, Typography } from "antd";
import ChatContext from './context/ChatContext';
import { useNavigate } from 'react-router-dom';

export const Profilecard = () => {
    const {cimg,cname,setpage}=useContext(ChatContext)
   const navigate=useNavigate();
   const handleclick=(e)=>{
    switch(e){
      case 1:
      setpage('1')
      // navigate('/ProfilePage');
      break;
    }
   }
   
    const { Title, Paragraph } = Typography;
  return (
    

    <div style={{ background: "#f0f2f5", padding: "24px", borderRadius: "8px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar size={128} src={cimg} />
          <Title level={2} style={{ marginTop: "16px" }}>{cname}</Title>
         <Button type='primary' onClick={()=>handleclick(1)}>View Profile</Button>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "16px" }}>
            <Title level={4}>About</Title>
            <Paragraph>
              I'm a passionate software engineer with a love for building innovative and user-friendly applications. In
              my free time, I enjoy exploring new technologies and contributing to open-source projects.
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  )
}
