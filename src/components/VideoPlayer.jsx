import React, { useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useContext } from 'react';
import UserContext from './context/context';

export const VideoPlayer = ({ user1, audioTrack, toggleAudio }) => {
  const ref = useRef();

  useEffect(() => {
    if (user1.videoTrack) {
      user1.videoTrack.play(ref.current);
    }
    return () => {
      if (user1.videoTrack) {
        user1.videoTrack.stop();
      }
    };
  }, [user1.videoTrack]);

  return (
    <div style={{ position: 'relative', width: '200px', height: '150px', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
      <div ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '10px', 
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        {user1.username || 'Anonymous'}
      </div>
      <button
        onClick={toggleAudio}
        style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: '5px'
        }}
      >
        {audioTrack && audioTrack.enabled ? <Mic color="white" /> : <MicOff color="white" />}
      </button>
    </div>
  );
};
