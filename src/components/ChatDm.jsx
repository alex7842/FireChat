import React, { useState,useContext,useRef, useEffect } from 'react';
import { Layout,Flex, Typography,message } from 'antd';
import { UserList } from './UserList';
import { PersonalChat } from './PersonalChat';
import {useNavigate  } from 'react-router-dom';
import UserContext from './context/context';
import { auth } from '../config/firebase';



import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { Button, Menu, Modal, Tour } from 'antd';

import GroupContext from './context/GroupContext';
// import { Group } from './Group';
import { CommunityGroup } from './CommunityGroup';
import { SideBar } from './SideBar';

const ChatDm = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const { user,setuser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [activetab,setactivetab]=useState('msg')
  const {setgroup}=useContext(GroupContext)
  const ref1 = useRef(null);
  const ref2 = useRef(null);

 
  const [open1, setOpen1] = useState(false);
  const steps = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => ref1.current,
    },
    {
      title: 'Save',
      description: 'Save your changes.',
      target: () => ref2.current,
    },
   
  ];
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };

  const signOut = () => {
    console.log('logging out')
  
    auth.signOut().then(() => {
      setuser(null);
      setgroup('message')
      localStorage.removeItem('user');
      navigate('/')
      
    }).catch(error => {
      console.error("Error during sign-out:", error);
    });
  };
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
  const handleactivetab=(m)=>{
    if (m==='msg'){
      setactivetab('msg');
      setgroup('message')
    }else{
      setactivetab('group');
      setgroup('community')
     
    }

  }
  


  // const handleMenuItemClick = (key) => {
   
  //   console.log(`Navigating to Home with user data: ${JSON.stringify(user)}`);
  //   navigate('/ChatComponent');
    
  // };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
     
        <SideBar/>
        {contextHolder}
        {/* <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              
              key: '1',
              icon: <UserOutlined />,
              label: 'Group Community',
              onClick: () => handleMenuItemClick('1'), // Use title instead of label for Ant Design v4 compatibility
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Logout',
              onClick:() => showModal(),
            },
            
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Reels',
              onClick:()=>success()
            },
            
            {
              key: '4',
              icon: <UserOutlined />,
              label: 'tour',
              onClick:()=>setOpen1(true)
            },
          ]}
        /> */}
    

      {/* Main Content Area */}
      <Layout>
       

        {/* Content Layout */}
        <Layout.Content >
          <Flex gap={0}>
            {/* User List */}
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
            <div className='userdiv'>
              <Flex align='center' justify='space-between' >
                <Flex align='center'>
        
          <Typography.Title className="ml-20" level={2}>{user.displayName}</Typography.Title>
          </Flex>
          <Flex ref={ref1} align='center'><FilterOutlined style={{fontSize:17}} /></Flex>
          </Flex>
          <Flex justify='space-between' align='center'>
  <div  onClick={()=>handleactivetab('msg')} style={{cursor: 'pointer',
            borderBottom: activetab==='msg' ? '2px solid blue' : 'none',
            paddingBottom: '3px' 
        }}>
            Messages
        </div>
        <div  onClick={()=>handleactivetab('group')} style={{cursor: 'pointer',
            borderBottom: activetab==='group' ? '2px solid blue' : 'none',
            paddingBottom: '3px' 
        }}>
           Community
        </div>
 </Flex>
 { activetab==='msg' ?
              <UserList  />:<CommunityGroup/>}
            </div>

          
            <div ref={ref2} className='div'>
             
              <PersonalChat />
            </div>
          </Flex>
          <Tour open={open1} onClose={() => setOpen1(false)} mask={false} type="primary" steps={steps} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default ChatDm;
