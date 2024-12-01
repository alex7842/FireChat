import React, { useState } from 'react';
import { Modal, Avatar, Typography, Input, message, Space } from 'antd';
import { CopyOutlined, WhatsAppOutlined, LinkedinOutlined, InstagramOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;


export const ShareProile = ({ isVisible, onClose, userImage, userName, profileUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      message.success('Profile URL copied!');
      setTimeout(() => setCopied(false), 2000);
    };
  
    const shareToWhatsApp = () => {
      window.open(`https://wa.me/?text=Check out ${userName}'s profile: ${profileUrl}`);
    };
  
    const shareToLinkedIn = () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`);
    };
  
    const shareToInstagram = () => {
      // Open Instagram app or website
      window.open('https://instagram.com');
    };
  
    return (
      <Modal
        open={isVisible}
        onCancel={onClose}
        footer={null}
        width={400}
        className="share-modal"
        centered
      >
        <div className="flex flex-col items-center p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Avatar 
              size={120} 
              src={userImage}
              className="border-4 border-violet-200 hover:border-violet-400 transition-all duration-300"
            />
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Title level={3} className="mt-4 text-violet-800">
              Share {userName}'s Profile
            </Title>
          </motion.div>
  
          <motion.div 
            className="w-full mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input.Group compact>
              <Input
                value={profileUrl}
                readOnly
                className="w-full p-2 border-2 border-violet-200 rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`ml-2 p-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-violet-500'} text-white transition-colors duration-300`}
              >
                <CopyOutlined />
              </motion.button>
            </Input.Group>
          </motion.div>
  
          <motion.div
            className="flex justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <WhatsAppOutlined 
                onClick={shareToWhatsApp}
                className="text-3xl text-green-500 cursor-pointer hover:text-green-600"
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <LinkedinOutlined 
                onClick={shareToLinkedIn}
                className="text-3xl text-blue-500 cursor-pointer hover:text-blue-600"
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <InstagramOutlined 
                onClick={shareToInstagram}
                className="text-3xl text-pink-500 cursor-pointer hover:text-pink-600"
              />
            </motion.div>
          </motion.div>
        </div>
      </Modal>
    );
}
