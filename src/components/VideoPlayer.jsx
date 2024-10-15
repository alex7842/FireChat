import React, { useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VideoPlayer = ({ user, audioTrack, toggleAudio }) => {
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack) {
      user.videoTrack.play(ref.current);
    }
    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();
      }
    };
  }, [user.videoTrack]);

  return (
    <div style={{ position: 'relative', width: '200px', height: '150px' }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }}></div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white' }}>
        User {user.uid}
      </div>
      <button
        onClick={toggleAudio}
        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {audioTrack && audioTrack.enabled ? <MicOff color="white" /> : <Mic color="white" />}
      </button>
    </div>
  );
};
