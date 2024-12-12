
import React,{useContext, useState,useEffect} from 'react';
import { Drawer, Switch, Button, Divider, Typography, Space, Modal, Collapse, Tag } from 'antd';
import { 
  SettingOutlined, DeleteOutlined, LockOutlined, BellOutlined, BulbOutlined,
  UserOutlined, SecurityScanOutlined, GlobalOutlined, KeyOutlined,
  PictureOutlined, TeamOutlined, EyeOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { auth } from '@/config/firebase';
import GroupContext from './context/GroupContext';
import UserContext from './context/context';
import { useNavigate } from 'react-router-dom';
import { collection,getDocs,deleteDoc,doc,updateDoc } from 'firebase/firestore';
import { User } from 'lucide-react';
import { db } from '@/config/firebase';
import { deleteUser } from "firebase/auth";

const { Panel } = Collapse;
const { Text, Title } = Typography;
export const ProfileSettings = () => {
  const [visible, setVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const {user,setuser}=useContext(UserContext)
const [isDarkMode, setIsDarkMode] = useState(false);
const [open,setOpen]=useState(false);
const {group,setgroup}=useContext(GroupContext)
const [notifications, setNotifications] = useState(true);
const navigate=useNavigate();



useEffect(() => {
  // Load privacy setting from localStorage on component mount
  const storedPrivacy = localStorage.getItem("isPrivate");
  if (storedPrivacy !== null) {
    setIsPrivate(storedPrivacy === "true");
  }
}, []);
const handleDeleteAccount = async () => {
  useEffect(() => {
    // Load privacy setting from localStorage on component mount
    const storedPrivacy = localStorage.getItem("isPrivate");
    if (storedPrivacy !== null) {
      setIsPrivate(storedPrivacy === "true");
    }
  }, []);
  Modal.confirm({
    title: 'Delete Account',
    content: 'Are you sure you want to delete your account? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        // Update user document to mark as invalid
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          valid: false,
          deactivatedAt: new Date()
        });

        // Sign out and clean up
        await auth.signOut();
        localStorage.clear();
        setuser(null);
        navigate('/');

      } catch (error) {
        console.error("Error deleting account:", error);
        Modal.error({
          title: 'Error',
          content: 'Failed to delete account. Please try again.'
        });
      }
    }
  });
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
  const handlePrivacyToggle = () => {
    if (!isPrivate) {
      // Enabling private mode
      Modal.confirm({
        title: "Enable Private Account",
        content: (
          <div className="space-y-2">
            <h3 className="font-medium">Private Account Features:</h3>
            <ul className="list-disc pl-5">
              <li>Restricted profile visibility</li>
              <li>Protected content downloads</li>
              <li>Profile visible only to approved followers</li>
              <li>Enhanced privacy controls</li>
              <li>Secure sharing options</li>
            </ul>
          </div>
        ),
        onOk: async () => {
          try {
            await updateDoc(doc(db, "users", user.uid), {
              isPrivate: true,
            });
            setIsPrivate(true);
            localStorage.setItem("isPrivate", "true");
            message.success("Privacy settings updated successfully");
          } catch (error) {
            message.error("Failed to update privacy settings");
          } finally {
            // Explicitly close the modal if necessary (usually not needed for Modal.confirm)
            Modal.destroyAll();
          }
        },
        okText: "Confirm",
        cancelText: "Cancel",
        okButtonProps: {
          className: "bg-violet-500 hover:bg-violet-600",
        },
      });
    } else {
      // Disabling private mode
      Modal.confirm({
        title: "Disable Private Account",
        content: "Are you sure you want to make your account public?",
        onOk: async () => {
          try {
            await updateDoc(doc(db, "users", user.uid), {
              isPrivate: false,
            });
            setIsPrivate(false);
            localStorage.setItem("isPrivate", "false");
            message.success("Privacy settings updated successfully");
          } catch (error) {
            message.error("Failed to update privacy settings");
          }
          finally{
            Modal.destroyAll();
          }
        },
        okText: "Confirm",
        cancelText: "Cancel",
        okButtonProps: {
          className: "bg-violet-500 hover:bg-violet-600",
        },
      });
    }
  };
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

      <SettingOutlined
        className="absolute right-4 top-4 cursor-pointer hover:scale-110 transition-transform"
        style={{ fontSize: '24px' }}
        onClick={() => setVisible(true)}
      />

      <Drawer
        title={<Title level={4}>Settings & Privacy</Title>}
        placement="right"
        width={380}
        onClose={() => setVisible(false)}
        visible={visible}
        className="settings-drawer"
      >
        <Space direction="vertical" className="w-full" size="large">
          
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header={<Space><UserOutlined /> Account Settings</Space>} key="1">
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-center p-2">
                  <Text>Private Account</Text>
                  <Switch onChange={handlePrivacyToggle} checked={isPrivate} />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Show Activity Status</Text>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Profile Visibility</Text>
                  <Tag color="blue" className="cursor-pointer">Public</Tag>
                </div>
              </Space>
            </Panel>

            <Panel header={<Space><SecurityScanOutlined /> Security</Space>} key="2">
              <Space direction="vertical" className="w-full">
                <Button type="text" block className="text-left">
                  <Space><KeyOutlined />End to End Encrypted</Space>
                </Button>
                <Button type="text" block className="text-left">
                  <Space><SafetyCertificateOutlined /> Two-Factor Authentication</Space>
                </Button>
               
              </Space>
            </Panel>

            <Panel header={<Space><BellOutlined /> Notifications</Space>} key="3">
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-center p-2">
                  <Text>Push Notifications</Text>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Email Notifications</Text>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Post Notifications</Text>
                  <Switch defaultChecked />
                </div>
              </Space>
            </Panel>

            <Panel header={<Space><GlobalOutlined /> Preferences</Space>} key="4">
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-center p-2">
                  <Text>Dark Mode</Text>
                  <Switch onChange={setIsDarkMode} checked={isDarkMode} />
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Language</Text>
                  <Tag color="blue" className="cursor-pointer">English</Tag>
                </div>
                <div className="flex justify-between items-center p-2">
                  <Text>Auto-play Videos</Text>
                  <Switch defaultChecked />
                </div>
              </Space>
            </Panel>
          </Collapse>

          <Divider className="my-2" />

          <Space direction="vertical" className="w-full">
          <Button
              
              className="bg-yellow-300 hover:bg-yellow-400 text-black w-full mb-3"
              
              
              onClick={()=>setOpen(true)}
            >
              Log Out
            </Button>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              className="w-full mb-3"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Space>
        </Space>
      </Drawer>

      <style jsx>{`
        .settings-drawer .ant-collapse {
          background: transparent;
        }
        .settings-drawer .ant-collapse-header {
          font-weight: 500;
        }
        .settings-drawer .ant-btn-text:hover {
          background-color: rgba(0,0,0,0.03);
        }
      `}</style>
    </>
  );
};
