import React, { useEffect, useState, useContext } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import UserContext from './context/context';

const APP_ID = '0446deea5d93437eae96def92c58c87e';
const TOKEN = '007eJxTYDjbJDTLXC8xPj5TcKopj5npyS0tjLVPzmnsFLlks/DCUikFBgMTE7OU1NRE0xRLYxNj89TEVEsgP83SKNnUItnCPFVir0d6QyAjw77Z+SyMDBAI4rMwJOakVjAwAACmcB3A';
const CHANNEL = 'alex';

AgoraRTC.setLogLevel(4);
let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({ onVideoTrack, onUserDisconnected, currentUserName }) => {
  const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });

  let localTracks;

  const waitForConnectionState = (connectionState) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (client.connectionState === connectionState) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const connect = async () => {
    await waitForConnectionState('DISCONNECTED');
    const localUid = await client.join(APP_ID, CHANNEL, TOKEN, null);

    client.on('user-published', async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);
      
      if (mediaType === 'video') {
        onVideoTrack(remoteUser);
      }
      if (mediaType === 'audio') {
        remoteUser.audioTrack.play();
      }
    });

    client.on('user-left', (remoteUser) => {
      onUserDisconnected(remoteUser);
    });

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    await client.publish(localTracks);

    return {
      localTracks,
      localUid,
      localUserName: currentUserName
    };
  };

  const disconnect = async () => {
    await waitForConnectionState('CONNECTED');
    client.removeAllListeners();
    for (let track of localTracks) {
      track.stop();
      track.close();
    }
    await client.unpublish(localTracks);
    await client.leave();
  };

  return {
    disconnect,
    connect,
  };
};

export const VideoRoom = () => {
  const { user } = useContext(UserContext);
  const [participants, setParticipants] = useState([]);
  const [localUid, setLocalUid] = useState(null);
  const [participantAudioTracks, setParticipantAudioTracks] = useState({});

  const toggleParticipantAudio = (participantId) => {
    setParticipantAudioTracks((prev) => {
      const track = prev[participantId];
      if (track && typeof track.setEnabled === 'function') {
        track.setEnabled(!track.enabled);
        return { ...prev, [participantId]: track };
      }
      return prev;
    });
  };

  useEffect(() => {
    const onVideoTrack = (remoteUser) => {
      setParticipants((prevParticipants) => [...prevParticipants, remoteUser]);
      if (remoteUser.audioTrack) {
        setParticipantAudioTracks((prev) => ({ ...prev, [remoteUser.uid]: remoteUser.audioTrack }));
      }
    };

    const onUserDisconnected = (remoteUser) => {
      setParticipants((prevParticipants) => 
        prevParticipants.filter((p) => p.uid !== remoteUser.uid)
      );
    };

    const { connect, disconnect } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
      currentUserName: user.displayName
    });

    const setupAgoraClient = async () => {
      const { localTracks, localUid, localUserName } = await connect();
      setLocalUid(localUid);
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        {
          uid: localUid,
          username: localUserName,
          audioTrack: localTracks[0],
          videoTrack: localTracks[1],
        },
      ]);
      setParticipantAudioTracks((prev) => ({ ...prev, [localUid]: localTracks[0] }));
    };

    const cleanupAgoraClient = async () => {
      await disconnect();
      setLocalUid(null);
      setParticipants([]);
      Object.values(participantAudioTracks).forEach((track) => {
        track.stop();
        track.close();
      });
      setParticipantAudioTracks({});
    };

    agoraCommandQueue = agoraCommandQueue.then(setupAgoraClient);

    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanupAgoraClient);
    };
  }, [user.displayName]);

  return (
   
      <div className="flex flex-col h-screen bg-primary/20 p-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1920px] mx-auto">
          {participants
            .sort((a, b) => (a.uid === localUid ? -1 : b.uid === localUid ? 1 : 0))
            .map((participant) => (
              <VideoPlayer
                key={participant.uid}
                user1={participant}
                audioTrack={participantAudioTracks[participant.uid]}
                toggleAudio={() => toggleParticipantAudio(participant.uid)}
              />
            ))}
        </div>
      </div>
    
  );
};
