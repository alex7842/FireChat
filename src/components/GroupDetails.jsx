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
import GroupContext from './context/GroupContext';
const { Title, Paragraph, Text } = Typography;

const GroupDetails = () => {
  const {draw,setdraw}=useContext(GroupContext)
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

  const renderContent = () => {
    switch (currentMenu) {
      case 'overview':
        return (
          <>
            <Title level={4}>2022 - 2026 Batch - III Year</Title>
            <Paragraph>Created: 09/08/2023 14:29</Paragraph>
            <Paragraph>Description</Paragraph>
            <Paragraph>Disappearing messages: Off</Paragraph>
            <Paragraph>Mute notifications</Paragraph>
            <Paragraph>Notification tone</Paragraph>
            <Divider />
            <Button type="primary" icon={<LogoutOutlined />}>
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
        <div style={{ padding: '16px' }}>{renderContent()}</div>
      </Drawer>
    </>
  );
};

export default GroupDetails;
