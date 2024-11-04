
import React,{useState} from 'react';
import { Drawer, Switch, Button, Divider, Typography, Space, Modal, Collapse, Tag } from 'antd';
import { 
  SettingOutlined, DeleteOutlined, LockOutlined, BellOutlined, BulbOutlined,
  UserOutlined, SecurityScanOutlined, GlobalOutlined, KeyOutlined,
  PictureOutlined, TeamOutlined, EyeOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;
export const ProfileSettings = () => {
  const [visible, setVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(false);
const [notifications, setNotifications] = useState(true);
const handleDeleteAccount = async () => {
    // Add confirmation modal and deletion logic
    Modal.confirm({
      title: 'Delete Account',
      content: 'Are you sure you want to delete your account? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        // Implement account deletion logic
      }
    });
  };

  return (
    <>
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
                  <Switch onChange={setIsPrivate} checked={isPrivate} />
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
                  <Space><KeyOutlined /> Change Password</Space>
                </Button>
                <Button type="text" block className="text-left">
                  <Space><SafetyCertificateOutlined /> Two-Factor Authentication</Space>
                </Button>
                <Button type="text" block className="text-left">
                  <Space><EyeOutlined /> Login Activity</Space>
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

          <Divider className="my-4" />

          <Space direction="vertical" className="w-full">
            <Button type="text" danger block className="text-left">
              <Space><TeamOutlined /> Block Users</Space>
            </Button>
            <Button type="text" block className="text-left">
              <Space><PictureOutlined /> Archived Posts</Space>
            </Button>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              className="w-full mt-4"
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
