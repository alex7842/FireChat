import React from 'react'
import { Layout,Menu,Divider,Typography, } from 'antd'
import { useNavigate } from 'react-router-dom';
import {
    HomeOutlined,
    SearchOutlined,
    CompassOutlined,
    PlaySquareOutlined,
    MessageOutlined,
    HeartOutlined,
    PlusSquareOutlined,
    UserOutlined,
    MoreOutlined,
  } from '@ant-design/icons';

export const SideBar = () => {
    const { Header, Content, Sider } = Layout;
    const navigate=useNavigate()
    const handleclick=(e)=>{
      switch(e){
        case 1:
        navigate('/ChatDm')
        break;
        case 2:
         navigate('/Home')
         break
        case 3:
         navigate('/ProfilePage')
         break
      }
    }
  return (
    <>
   
    <Sider width={220} className="site-layout-background">
    <Menu
  
    
    style={{ height: '100%', borderRight: 0 }}
    // Set theme to light to avoid default blue color
  >
    <Divider />
    <div style={{ marginLeft: '13px', display: 'flex', justifyContent: 'start' }}>
      <Typography.Title level={2}>FireChat</Typography.Title>
    </div>
    <br />
    <br />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div onClick={()=>handleclick(2)} className='menu-item'
        key="home"
      
        
      >
        <HomeOutlined  style={{fontSize:'24px'}} className='icon'/>
        Home
      </div>
      <div className='menu-item'
        key="Search"
    
     
      >
        <SearchOutlined style={{fontSize:'24px'}}/>
        Search
      </div>
      <div className='menu-item'
        key="Explore"
      
        
      >
        <CompassOutlined style={{fontSize:'24px'}} />
        Explore
      </div>
      <div className='menu-item'
     
        
      >
       <PlaySquareOutlined style={{fontSize:'24px'}} />
        Reels
      </div>
      <div className='menu-item'
        key="message" onClick={()=>handleclick(1)}
  
       
      >
        <MessageOutlined  style={{fontSize:'24px'}} />
        Message
      </div>
      <div className='menu-item'
        key="notifications"

      
      >
        <HeartOutlined style={{fontSize:'24px'}} />
        Notification
      </div>
      <div className='menu-item'
        key="profile"
        onClick={()=>handleclick(3)}
       
      >
        <UserOutlined style={{fontSize:'24px'}} />
        Profile
      </div>
      <div className='menu-item'
        key="More"
   
        
      >
        <MoreOutlined style={{fontSize:'24px'}}/>
        More
      </div>
    </div>
  </Menu>
    </Sider>
 

 </>
  )
}
