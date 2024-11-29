import React, { useContext,useEffect } from 'react'
import { useState } from 'react';
import { Avatar, Button, Typography } from "antd";
import ChatContext from './context/ChatContext';
import { useNavigate } from 'react-router-dom';
import UserContext from './context/context';
import { collection,getDocs,doc,getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import {Tag} from 'antd';
import {EnvironmentOutlined,MailOutlined } from '@ant-design/icons'
export const Profilecard = () => {
    const {cimg,cname,setpage,targetuserid}=useContext(ChatContext)
    const {user}=useContext(UserContext)
const [userdata,setuserdata]=useState({});
   const navigate=useNavigate();
   console.log(targetuserid);
   useEffect(()=>{
    const fetchdetails= async ()=>{
     
      const userRef = doc(db, "users", targetuserid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      setuserdata(docSnap.data());
    }
      console.log(docSnap.data());
    }
    fetchdetails();
   },[])
   const handleclick=(e)=>{
    switch(e){
      case 1:
    
       navigate(`/Profilepage/${targetuserid}`);
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
        <button className='bg-violet-500 text-white hover:bg-violet-600 p-2 border rounded-full px-4 transition-all duration-300' 
                onClick={()=>handleclick(1)}>
          View Profile
        </button>
      </div>
  
      <div style={{ width: "100%" }}>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
           <MailOutlined className="text-violet-500 text-xl" /> 
            <span>{userdata.email}</span>
          </div>
  
  
          <div className="flex items-center gap-3">
            <EnvironmentOutlined className="text-violet-500 text-xl" />
            <span>India </span>
          </div>
  
          <div className="mt-4">
            <Title level={4}>Skills & Interests</Title>
            <div className="flex flex-wrap gap-2 mt-2">
                <Tag  color="purple" className="px-3 py-1 rounded-full">
                  {userdata.tags}
                </Tag>
         
            </div>
          </div>
  
          <div className="mt-4">
            <Title level={4}>About</Title>
            <Paragraph>{userdata.description}</Paragraph>
          </div>
  
         
         
        </div>
      </div>
    </div>
  </div>
  
  )
}
