import React, { useState,useContext,useRef, useEffect } from 'react';
import { Layout,Flex, Typography,message } from 'antd';
import { UserList } from './UserList';
import { PersonalChat } from './PersonalChat';
import {useNavigate  } from 'react-router-dom';
import UserContext from './context/context';
import { MessageCircle,Users } from 'lucide-react';
import {
  ArrowLeftOutlined,
  FilterOutlined,
  
} from '@ant-design/icons';
import { Button, Menu, Modal, Tour } from 'antd';

import GroupContext from './context/GroupContext';
// import { Group } from './Group';
import { CommunityGroup } from './CommunityGroup';
import { SideBar } from './SideBar';
import { Videocall } from './Videocall';

const ChatDm = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const { user,setuser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const {videocall} =useContext(GroupContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [activetab,setactivetab]=useState('msg')
  const {setgroup}=useContext(GroupContext)
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
 
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

  // const signOut = () => {
  //   console.log('logging out')
  
  //   auth.signOut().then(() => {
  //     setuser(null);
  //     setgroup('message')
  //     localStorage.removeItem('user');
  //     navigate('/')
      
  //   }).catch(error => {
  //     console.error("Error during sign-out:", error);
  //   });
  // };
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
    <SideBar showChat={showChat}/>
    {contextHolder}
    
    <Layout className="md:ml-[220px]">
      <Layout.Content>
        <div className="md:hidden">
          {/* Mobile View */}
          {showChat ? (
            <div className="h-screen">
             
              <PersonalChat onBack={() => setShowChat(false)} />
            </div>
          ) : (
            <div className="h-screen">
  <div className="p-6 border-b bg-white shadow-sm">
    {/* User Profile Section */}
    <div className="flex items-center gap-3 mb-6">
      <img 
        src={user.photoURL} 
        alt="profile"
        className="w-12 h-12 rounded-full border-2 border-blue-500"
      />
      <div>
        <Typography.Title 
          level={3} 
          className="m-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {user.displayName}
        </Typography.Title>
        <span className="text-gray-500 text-sm">Online</span>
      </div>
    </div>

    {/* Navigation Tabs */}
    <Flex justify="center" align="center" className="mt-4">
      <div className="flex gap-12 text-lg font-medium">
        <div
          onClick={() => handleactivetab('msg')}
          className={`
            flex items-center gap-2 cursor-pointer pb-2 px-4
            transition-all duration-300 transform hover:scale-105
            ${activetab === 'msg' 
              ? 'border-b-2 border-blue-500 text-blue-600 translate-y-[-2px]' 
              : 'text-gray-500 hover:text-blue-500'
            }
          `}
        >
          <MessageCircle className="w-6 h-6" />
          Messages
        </div>

        <div
          onClick={() => handleactivetab('group')}
          className={`
            flex items-center gap-2 cursor-pointer pb-2 px-4
            transition-all duration-300 transform hover:scale-105
            ${activetab === 'group' 
              ? 'border-b-2 border-blue-500 text-blue-600 translate-y-[-2px]' 
              : 'text-gray-500 hover:text-blue-500'
            }
          `}
        >
          <Users className="w-6 h-6" />
          Community
        </div>
      </div>
    </Flex>
  </div>

  {/* Content Section */}
  <div className="animate-fadeIn">
    {activetab === 'msg' ? (
      <UserList 
        onUserSelect={(user) => {
          setSelectedUser(user);
          setShowChat(true);
        }} 
      />
    ) : (
      <CommunityGroup 
        onGroupSelect={(group) => {
          setSelectedUser(group);
          setShowChat(true);
        }} 
      />
    )}
  </div>
</div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
  <Flex className="h-screen">
    {/* Sidebar */}
    <div className="w-[380px] border-r bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <Flex align='center' justify='space-between'>
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL} 
              alt="profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <Typography.Title 
              level={2} 
              className="m-0 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {user.displayName}
            </Typography.Title>
          </div>
          <div ref={ref1} className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
            <FilterOutlined className="text-xl text-gray-600" />
          </div>
        </Flex>

        {/* Navigation Tabs */}
        <Flex justify='center' className="mt-6">
          <div className="flex gap-12 text-lg font-medium">
            <div
              onClick={() => handleactivetab('msg')}
              className={`
                flex items-center gap-2 cursor-pointer pb-2 px-4
                transition-all duration-300 transform hover:scale-105
                ${activetab === 'msg' 
                  ? 'border-b-2 border-blue-500 text-blue-600 translate-y-[-2px]' 
                  : 'text-gray-500 hover:text-blue-500'
                }
              `}
            >
              <MessageCircle className="w-5 h-5" />
              Messages
            </div>
            <div
              onClick={() => handleactivetab('group')}
              className={`
                flex items-center gap-2 cursor-pointer pb-2 px-4
                transition-all duration-300 transform hover:scale-105
                ${activetab === 'group' 
                  ? 'border-b-2 border-blue-500 text-blue-600 translate-y-[-2px]' 
                  : 'text-gray-500 hover:text-blue-500'
                }
              `}
            >
              <Users className="w-5 h-5" />
              Community
            </div>
          </div>
        </Flex>
      </div>

      {/* List Content */}
      <div className="animate-fadeIn h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
  {activetab === 'msg' ? <UserList /> : <CommunityGroup />}
</div>
    </div>

    {/* Chat Area */}
    <div ref={ref2} className="flex-1 bg-gray-50">
      <PersonalChat />
    </div>
  </Flex>
</div>


        <Tour open={open1} onClose={() => setOpen1(false)} mask={false} type="primary" steps={steps} />
      </Layout.Content>
    </Layout>
  </Layout>
  );
};

export default ChatDm;
