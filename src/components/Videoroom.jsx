import React, { useEffect, useState, useContext } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import UserContext from './context/context';

const APP_ID = '0446deea5d93437eae96def92c58c87e';
const TOKEN = '007eJxTYHggG/t13oqav4L7ayNWfHpUrmIvL7gr76xU8zeVXT6uy/0UGAxMTMxSUlMTTVMsjU2MzVMTUy2B/DRLo2RTi2QL89RXunrpDYGMDJOkQ1kYGSAQxGdhSMxJrWBgAACLfh+p';
const CHANNEL = 'alex';

AgoraRTC.setLogLevel(4);
let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({ onVideoTrack, onUserDisconnected, username }) => {
  const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });

  let tracks;

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
    const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      user.username = username;
      
      if (mediaType === 'video') {
        onVideoTrack(user);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    client.on('user-left', (user) => {
      onUserDisconnected(user);
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    await client.publish(tracks);

    return {
      tracks,
      uid,
      username
    };
  };

  const disconnect = async () => {
    await waitForConnectionState('CONNECTED');
    client.removeAllListeners();
    for (let track of tracks) {
      track.stop();
      track.close();
    }
    await client.unpublish(tracks);
    await client.leave();
  };

  return {
    disconnect,
    connect,
  };
};

export const VideoRoom = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(null);
  const [audioTracks, setAudioTracks] = useState({});

  const toggleAudio = (userId) => {
    setAudioTracks((prev) => {
      const track = prev[userId];
      if (track && typeof track.setEnabled === 'function') {
        track.setEnabled(!track.enabled);
        return { ...prev, [userId]: track };
      }
      return prev;
    });
  };

  useEffect(() => {
    const onVideoTrack = (user) => {
      setUsers((previousUsers) => [...previousUsers, user]);
      if (user.audioTrack) {
        setAudioTracks((prev) => ({ ...prev, [user.uid]: user.audioTrack }));
      }
    };

    const onUserDisconnected = (user) => {
      setUsers((previousUsers) => previousUsers.filter((u) => u.uid !== user.uid));
    };

    const { connect, disconnect } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
      username: user.displayName
    });

    const setup = async () => {
      const { tracks, uid, username } = await connect();
      setUid(uid);
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
          username,
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        },
      ]);
      setAudioTracks((prev) => ({ ...prev, [uid]: tracks[0] }));
    };

    const cleanup = async () => {
      await disconnect();
      setUid(null);
      setUsers([]);
      Object.values(audioTracks).forEach((track) => {
        track.stop();
        track.close();
      });
      setAudioTracks({});
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);

    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, [user.displayName]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
          gap: '10px',
        }}
      >
        {users.map((user) => (
          <VideoPlayer
            key={user.uid}
            user1={user}
            audioTrack={audioTracks[user.uid]}
            toggleAudio={() => toggleAudio(user.uid)}
          />
        ))}
      </div>
    </div>
  );
};
