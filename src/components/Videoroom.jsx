import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import { Mic, MicOff } from 'lucide-react';

const APP_ID = '0446deea5d93437eae96def92c58c87e';
const TOKEN =
  '007eJxTYFBv43xb3n3r+fOZ5ZGT1k4umJ8/V2OJU+utS+LvJ2dEa/1TYDAwMTFLSU1NNE2xNDYxNk9NTLUE8tMsjZJNLZItzFMnruVLbwhkZBD3iGZghEIQn4UhMSe1goEBANoxIKU=';
const CHANNEL = 'alex';

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({
  onVideoTrack,
  onUserDisconnected,
}) => {
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

    const uid = await client.join(
      APP_ID,
      CHANNEL,
      TOKEN,
      null
    );

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
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

    tracks =
      await AgoraRTC.createMicrophoneAndCameraTracks();

    await client.publish(tracks);

    return {
      tracks,
      uid,
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
  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(null);
  const [audioTracks, setAudioTracks] = useState({});
  const toggleAudio = (userId) => {
    setAudioTracks((prev) => {
      const track = prev[userId];
      if (track) {
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
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    };

    const { connect, disconnect } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
    });

    const setup = async () => {
      const { tracks, uid } = await connect();
      setUid(uid);
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
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
    

    // setup();
    agoraCommandQueue = agoraCommandQueue.then(setup);

    return () => {
      // cleanup();
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);

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
            user={user}
            audioTrack={audioTracks[user.uid]}
            toggleAudio={() => toggleAudio(user.uid)}
          />
        ))}
      </div>
    </div>
  );
};
