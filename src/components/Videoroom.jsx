import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import { Mic, MicOff } from 'lucide-react';

const APP_ID = '0446deea5d93437eae96def92c58c87e';
const TOKEN =
  '007eJxTYDh/02f9tIcPrKZO7sv8EWkUJSuo/MPQPivQy9JcX/XdvVYFBgMTE7OU1NRE0xRLYxNj89TEVEsgP83SKNnUItnCPHUtI096QyAjQ5jUDAZGKATxWRgSc1IrGBgAJZUd/g==';
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
    <>
      {uid}
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
          }}
        >
          {users.map((user) => (
            <VideoPlayer key={user.uid} user={user} />
          ))}
        </div>
        <div>
          {Object.entries(audioTracks).map(([uid, track]) => (
            <div key={uid}>
              <span>User {uid} Audio: </span>
              <button onClick={() => track.setEnabled(!track.enabled)}>
                {track.enabled ? <Mic/>  : <MicOff/>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
};
