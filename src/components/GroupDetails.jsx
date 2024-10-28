import React, { useContext, useEffect, useState } from 'react';
import { Drawer, Menu, Avatar, Typography, Divider, Button, List } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  LinkOutlined,
  LockOutlined,

  LogoutOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { db } from '../config/firebase';
import { deleteDoc,doc } from 'firebase/firestore';
import GroupContext from './context/GroupContext';
import ChatContext from './context/ChatContext';
const { Title, Paragraph, Text } = Typography;

const GroupDetails = () => {
  const [groupdet,setgroupdet]=useState();
  const {fetchgroup,setfetchgroup}=useContext(ChatContext);
  const {draw,setdraw,groupdetails,setgroupdetails,selectedgroupid,setselectedgroupid,setgroup,setisgroup}=useContext(GroupContext);
  useEffect(() => {
    if (groupdetails && selectedgroupid) {
      setgroupdet(groupdetails.filter(group => group.id === selectedgroupid)[0])
    }
  }, [selectedgroupid, groupdetails])
  
  //console.log("groupdetails",groupdet);
 const [visible,setVisible]=useState(false);
  const [currentMenu, setCurrentMenu] = useState('overview');
   useEffect(()=>{
    setVisible(draw)
   },[draw])
  const onClose = () => {
    setdraw(false)
    setVisible(false);
  };

  const menuItems = [
    { key: 'overview', icon: <UserOutlined />, label: 'Overview' },
    { key: 'members', icon: <TeamOutlined />, label: 'Members' },
    { key: 'media', icon: <FileOutlined />, label: 'Media' },
    { key: 'files', icon: <FileOutlined />, label: 'Files' },
    { key: 'links', icon: <LinkOutlined />, label: 'Links' },
    { key: 'encryption', icon: <LockOutlined />, label: 'Encryption' },
  ];
  const leave = async () => {
    try {
      await deleteDoc(doc(db, "Groupusers", selectedgroupid));
      message.success('Successfully left the group');
      setdraw(false);
      setVisible(false);
      setgroup('message');
      setfetchgroup((i)=>i+1);
      setisgroup(true);
      //setgroupdetails(groupdetails.filter(group => group.id !== selectedgroupid));
    } catch (error) {
      console.log("Error leaving group:", error);
    }
  };
  const renderContent = (groupdet) => {
    //console.log("groupdetails from render ",groupdet);
    switch (currentMenu) {
      case 'overview':
        return (
          <>
            <Title level={4}>{groupdet?.groupname?.toUpperCase()}</Title>
            <Paragraph>{`Created: ${groupdet?.day || 'Date'} ${groupdet?.time || 'Time'}`}</Paragraph>

            <Paragraph>{`Description ${groupdet?.description ||"description"}`}</Paragraph>
            <Paragraph>Disappearing messages: Off</Paragraph>
            <Paragraph>Mute notifications</Paragraph>
            <Paragraph>Notification tone</Paragraph>
            <Divider />
            <Button type="primary"  onClick={leave} icon={<LogoutOutlined />}>
              Exit group
            </Button>
            <Button type="danger" icon={<WarningOutlined />}>
              Report group
            </Button>
          </>
        );
      case 'members':
        return (
          <List
            itemLayout="horizontal"
            dataSource={[
              { name: 'Member 1', role: 'Admin' },
              { name: 'Member 2', role: 'Member' },
              // Add more members here
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={item.role}
                />
              </List.Item>
            )}
          />
        );
      // Add more cases for other menu items
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Button type="primary" onClick={showDrawer}>
        Open Group Details
      </Button> */}
      <Drawer
        title="Group Details"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <Menu
          mode="inline"
          selectedKeys={[currentMenu]}
          onClick={({ key }) => setCurrentMenu(key)}
          items={menuItems}
        />
        <div style={{ padding: '16px' }}>{renderContent(groupdet)}</div>
      </Drawer>
    </>
  );
};

export default GroupDetails;
