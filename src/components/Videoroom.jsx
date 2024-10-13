import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = '0446deea5d93437eae96def92c58c87e';
const TOKEN = '007eJxTYDh/02f9tIcPrKZO7sv8EWkUJSuo/MPQPivQy9JcX/XdvVYFBgMTE7OU1NRE0xRLYxNj89TEVEsgP83SKNnUItnCPHUtI096QyAjQ5jUDAZGKATxWRgSc1IrGBgAJZUd/g==';
const CHANNEL = 'alex';

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({
  onTrack,
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
      onTrack(user, mediaType);
    });

    client.on('user-left', (user) => {
      onUserDisconnected(user);
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

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

  useEffect(() => {
    const onTrack = (user, mediaType) => {
      setUsers((previousUsers) => {
        const existingUser = previousUsers.find(u => u.uid === user.uid);
        if (existingUser) {
          return previousUsers.map(u => 
            u.uid === user.uid 
              ? { ...u, [mediaType + 'Track']: user[mediaType + 'Track'] }
              : u
          );
        } else {
          return [...previousUsers, { 
            uid: user.uid, 
            [mediaType + 'Track']: user[mediaType + 'Track'] 
          }];
        }
      });
    };

    const onUserDisconnected = (user) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    };

    const { connect, disconnect } = createAgoraClient({
      onTrack,
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
    };

    const cleanup = async () => {
      await disconnect();
      setUid(null);
      setUsers([]);
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);

    return () => {
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
      </div>
    </>
  );
};
