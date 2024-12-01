import React, { useState, useEffect } from 'react'
import { Avatar, Progress } from 'antd'
import { motion } from 'framer-motion'
import { CloseOutlined } from '@ant-design/icons'

export const StoryView = ({ onclose, selectedStory,owner }) => {
  const [progress, setProgress] = useState(0)
  //console.log(owner)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 9000; // 5 seconds
    let animationFrameId;
  
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(progress);
  
      if (progress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => onclose(), 200);
      }
    };
  
    animationFrameId = requestAnimationFrame(updateProgress);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative max-w-lg mx-auto h-[80vh] bg-black rounded-xl overflow-hidden"
    >
      {/* Progress Bar - Positioned at the very top */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor="#fff"
          trailColor="rgba(255,255,255,0.3)"
          className="story-progress"
          style={{ height: '2px', borderRadius: 0 }}
        />
      </div>
  
      {/* Rest of your existing code */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 z-10 flex items-center space-x-3 bg-black/30 p-2 rounded-full"
      >
        <Avatar
          src={owner=="firechat"?"/logo3.png":selectedStory?.photoURL}
          size={40}
          className="border-2 border-white"
        />
        <span className="text-white font-semibold">
          {owner=="firechat"?"FireChat🔥":selectedStory?.displayName}
        </span>
      </motion.div>
  
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="w-full h-full"
      >
        {selectedStory?.mediaType === 'video' ? (
          <video
            src={selectedStory?.mediaUrl}
            className="w-full h-full object-contain"
            autoPlay
            controls
          />
        ) : (
          <img
            src={owner=="firechat"? "/Storypost1.jpg" :selectedStory?.mediaUrl}
            alt={selectedStory?.displayName}
            className="w-full h-full object-contain"
          />
        )}
      </motion.div>
  
      {(selectedStory?.caption || owner === "firechat") && (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="absolute bottom-2 right-6 max-w-[80%] p-4 rounded-lg"
  >
    <p className="text-white text-sm">
      {owner === "firechat" ? "Welcome Start Chatting Now❤️❤️" : selectedStory?.caption}
    </p>
  </motion.div>
)}

    </motion.div>
  )
  
}
