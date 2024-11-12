import React from 'react';
import { Drawer, Typography, Row, Col } from 'antd';

const themes = [
  { id: 1, color: '#ffffff', name: 'Light' },
  { id: 2, color: '#f0f2f5', name: 'Default' },
  { id: 3, color: '#dcf8c6', name: 'Mint' },
  { id: 4, color: '#ffd1dc', name: 'Rose' },
  { id: 5, color: '#e8eaf6', name: 'Lavender' }
];

export const ChatThemes = ({ visible, onClose, onThemeSelect }) => {
  return (
    <Drawer
      title="Chat Settings"
      placement="right"
      onClose={onClose}
      open={visible}
      width={320}
    >
      <Typography.Title level={5}>Chat Themes</Typography.Title>
      <Row gutter={[16, 16]} className="mt-4">
        {themes.map((theme) => (
          <Col span={12} key={theme.id}>
            <div
              onClick={() => onThemeSelect(theme.color)}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <div
                style={{
                  backgroundColor: theme.color,
                  height: '100px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0'
                }}
                className="shadow-sm hover:shadow-md transition-shadow"
              />
              <Typography.Text className="mt-2 block text-center">
                {theme.name}
              </Typography.Text>
            </div>
          </Col>
        ))}
      </Row>
    </Drawer>
  );
};
