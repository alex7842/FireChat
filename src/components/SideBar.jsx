import React, { useContext, useState } from 'react';
import { Layout, Menu, Divider, Typography, Modal,Button } from 'antd';
import { useLocation } from 'react-router-dom';

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

export const SideBar = ({showChat}) => {
    const { Header, Content, Sider } = Layout;
    const { user,setuser,setupdateuser,globaltrigger,setglobaltrigger } = useContext(UserContext);
    const {setgroup}=useContext(GroupContext)
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(getInitialSelectedKey(location.pathname));
    function getInitialSelectedKey(pathname) {
      if (pathname.includes('/ChatDm')) return '1';
      if (pathname.includes('/Home')) return '2';
      if (pathname.includes('/ProfilePage')) return '3';
      if (pathname.includes('/Notifications')) return '4';
      if (pathname.includes('/Search')) return '5';
      return '2'; // Default to Home
    }
    const navigate=useNavigate()
    
    const handleclick = (key) => {
      setglobaltrigger(prev => prev + 1);
      setSelectedKey(key);
    
      switch (key) {
        case '1':
          navigate('/ChatDm');
          break;
        case '2':
          navigate('/Home');
          localStorage.removeItem("chatrommid");
          localStorage.removeItem("personalChats");
          break;
        case '3':
          navigate(`/ProfilePage/${user.uid}`);
          break;
        case '4':
          navigate(`/Notifications`);
          break;
        case '5':
          navigate(`/Search`);
          break;
        case 'logout':
          setOpen(true);
          break;
      }
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
    const menuItems = [
      { key: '2', icon: HomeOutlined, label: 'Home' },
      { key: '5', icon: SearchOutlined, label: 'Search' },
      { key: '1', icon: MessageOutlined, label: 'Message' },
      { key: '4', icon: HeartOutlined, label: 'Notification' },
      { key: '3', icon: UserOutlined, label: 'Profile' },
      { key: 'logout', icon: MoreOutlined, label: 'Logout' }
    ];
    
  return (
    <>
      <Modal
  open={open}
  title={<span className="text-xl font-semibold text-violet-800">Are you Sure want to Logout?</span>}
  onOk={handleOk}
  onCancel={handleCancel}
  centered
  className="custom-modal"
  footer={(_, { OkBtn, CancelBtn }) => (
    <div className="flex gap-3 justify-end">
    <button 
      onClick={handleCancel}
      className="px-6 py-2 rounded-md border border-gray-300 hover:border-violet-400 hover:text-violet-500 transition-colors duration-300"
    >
      Cancel
    </button>
    <button 
      onClick={handleOk}
      className="px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white border-none transition-colors duration-300"
    >
      Logout
    </button>
  </div>
  )}
>
  <div className="py-4">
    <p className="text-gray-600">You will be logged out from your account.</p>
  </div>
</Modal>

      <div className="hidden md:block">
      <Sider width={220} className="site-layout-background fixed left-0 top-0 h-screen">

    <Menu className="h-full border-r-0">
      <Divider />
      <div className="ml-4 flex justify-start items-center gap-3">
        <img className="w-8  h-8" src="/logo3.png"/>
        <Typography.Title level={2} className="hover:scale-105 transition-transform mt-2">FireChat</Typography.Title>
      </div>
      <div className="flex flex-col gap-5 mt-8">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleclick(item.key)}
            className={`menu-item transition-all duration-300 hover:scale-105 ${
              selectedKey === item.key
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold'
              : 'text-gray-600 '
            }`}
          >
<item.icon
  className={`text-2xl transition-all duration-300 ${
    selectedKey === item.key
    ? ' text-violet-500  drop-shadow-lg'
    : 'text-gray-500  hover:drop-shadow-md'
  }`}
/>

            {item.label}
          </div>
        ))}
      </div>
    </Menu>
  </Sider>
</div>

{/* Mobile Bottom Navigation */}
{!showChat && (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50 shadow-lg">
    <div className="flex justify-around items-center h-16">
      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleclick(item.key)}
          className={`p-2 rounded-full transition-all duration-300 active:scale-90 hover:bg-gray-100 ${
            selectedKey === item.key
              ? 'text-violet-500 scale-110 shadow-md'
              : 'text-gray-600 hover:scale-105'
          }`}
        >
          <item.icon className="text-2xl" />
        </div>
      ))}
    </div>
  </div>
)}
    </>
  )}
