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
    <div className="relative aspect-video  rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/80"></div>
      
      <div ref={ref} className="w-full h-full object-cover"></div>
      
      {/* User name overlay */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <div className="bg-violet-500 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white font-medium">
            {user1.username || 'Anonymous'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button
          onClick={toggleAudio}
          className="bg-violet-500 hover:bg-violet-600 text-white backdrop-blur-sm p-2.5 rounded-full transition-colors duration-200"
        >
          {audioTrack && audioTrack.enabled ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-black" />
          )}
        </button>
      </div>
    </div>
  );
};
