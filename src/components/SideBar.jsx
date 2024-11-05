import React,{useContext,useState}from 'react'
import { Layout,Menu,Divider,Typography,Modal } from 'antd'
import { useNavigate } from 'react-router-dom';
import GroupContext from './context/GroupContext';
import UserContext from './context/context';
import { auth } from '../config/firebase';
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
    const { user,setuser,setupdateuser,globaltrigger,setglobaltrigger } = useContext(UserContext);
    const {setgroup}=useContext(GroupContext)
    const [open, setOpen] = useState(false);

    const navigate=useNavigate()
    const handleclick=(e)=>{
      setglobaltrigger(prev => prev + 1);
      switch(e){
       
        case 1:
          
        navigate('/ChatDm')
        break;
        case 2:
         navigate('/Home')
         localStorage.removeItem("chatrommid")
         localStorage.removeItem("personalChats")
         break
        case 3:
         navigate(`/ProfilePage/${user.uid}`)
         break
         case 4:
          navigate(`/Notifications`)
          break
       
      }
    }
    const showModal = () => {
      setOpen(true);
      console.log("modal")
    };
    const handleOk = () => {
      setOpen(false);
      signOut()
    };
    const handleCancel = () => {
      setOpen(false);
    };
    const signOut = () => {
      console.log('logging out')
    
      auth.signOut().then(() => {
     
        setgroup('message')
        localStorage.removeItem('user');
        localStorage.setItem("isloggedin", "false");
        localStorage.removeItem('cachedPosts')

        setuser(null);
        navigate('/');
     //   setupdateuser(prev => prev + 1); // Trigger the useEffect
        // setTimeout(() => {
        //   navigate('/');
        // }, 100);
        

        
      }).catch(error => {
        console.error("Error during sign-out:", error);
      });
    };
  return (
    <>
      <Modal
        open={open}
        title="Are you Sure want to Logout ?"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
           
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
     
      </Modal>
   
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
      <div className='menu-item' onClick={()=>handleclick(4)}
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
        key="Logout" onClick={()=>setOpen(true)}
   
        
      >
        <MoreOutlined style={{fontSize:'24px'}} />
       Logout
      </div>
    </div>
  </Menu>
    </Sider>
 

 </>
  )
}
