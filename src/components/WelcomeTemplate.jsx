import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from 'antd';
import SparklesText from './ui/sparkles-text';
export const WelcomeTemplate = () => {
  return (
    <motion.div 
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="mb-8"
      >
        <motion.img
          src="/newslogo.png" 
          alt="FireChat Logo"
          className="w-32 h-32"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Typography.Title level={2} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
        <SparklesText text={"Welcome to FireChat"}/>
        </Typography.Title>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-gray-600"
        >
          <p className="text-lg">Start chatting with your friends and family 😄</p>
          <motion.div 
            className="mt-6 flex gap-2 justify-center"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <span className="text-2xl">👋</span>
            <span className="text-2xl">💭</span>
            <span className="text-2xl">✨</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Select a chat to start messaging
      </motion.div>
    </motion.div>
  );
};
