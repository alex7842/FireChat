import React, { useContext, useEffect, useState } from 'react';
import { Drawer, Menu,Switch, Avatar, Typography, Divider, Button, List, Empty } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  LinkOutlined,
  LockOutlined,

ArrowRightOutlined,
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
            <div className="flex items-center justify-between mb-2">
    <Typography.Paragraph className="mb-0">Mute notifications</Typography.Paragraph>
    <Switch 
        defaultChecked={false}
        className="bg-gray-200" 
        checkedChildren="On" 
        unCheckedChildren="Off"
        style={{ backgroundColor: '#8B5CF6'}}
    />
</div>

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
            dataSource={groupdet?.members || []}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item}
                  description={item==groupdet.admin?<Typography.Paragraph className='text-violet-700 font-bold text-sm'>Admin</Typography.Paragraph>
                    :"Member"}
                />
              </List.Item>
            )}
          />
        );
        case 'encryption':
          return (
            <div className="flex flex-col items-center space-y-4 p-4">
            <div className="flex items-center gap-2">
                <LockOutlined className="text-2xl text-violet-600" />
                <Title level={4} className="m-0">Encryption</Title>
            </div>
            <div className="text-center space-y-2">
                <Paragraph className="text-gray-700">
                    This group is encrypted. Only you and the people can see your  shared  or send messages.
                </Paragraph>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
    
    <Paragraph className="mb-0">
        To make as  private : Go to Profile <ArrowRightOutlined className="text-xs mx-1"/> Settings <ArrowRightOutlined className="text-xs mx-1"/> <LockOutlined className="text-xs mx-1"/> Private
    </Paragraph>
</div>

            </div>
        </div>
        
          );
          case 'media':
            return (
            <Empty description="No media available" />
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
