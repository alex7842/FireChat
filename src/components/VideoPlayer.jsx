import React, {
    useEffect,
   
    useRef,
  } from 'react';
  import { Mic,MicOff } from 'lucide-react';
  
export const VideoPlayer = ({ user,audiotracks }) => {
    const ref = useRef();
  
    useEffect(() => {
      user.videoTrack.play(ref.current);
    }, []);
  
    return (
      <div>
        Uid: {user.uid}
        <div
          ref={ref}
          style={{ width: '200px', height: '200px' }}
        ></div>
         <div>
          {Object.entries(audiotracks).map(([uid, track]) => (
            <div key={uid}>
              <span>User {uid} Audio: </span>
              <button onClick={() => track.setEnabled(!track.enabled)}>
                {track.enabled ? <Mic/>  : <MicOff/>}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  