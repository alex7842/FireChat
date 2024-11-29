import { Modal, Upload, Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL,getStorage} from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useContext } from 'react';
import UserContext from './context/context';
import ChatContext from './context/ChatContext';
import { SendOutlined } from '@ant-design/icons';
import { WandSparkles } from 'lucide-react';
import ai from '@/hooks/ai';
export const UploadPosts = ({uid,settrigger}) => {
  // Move all state declarations to the top level of the component
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const {user} = useContext(UserContext);
  const {sethomereload} =useContext(ChatContext);
  const { suggestions, loading, error, fetchSuggestions,setSuggestions } = ai();
  const handleIconClick = () => {
    console.log("Icon clicked! Caption:", caption);
    fetchSuggestions(
      `Transform this text into a two-line Instagram caption with emojis:
${caption}

Format exactly like this:
[First line with relevant emojis]
[Second line with relevant emojis]`
,
      0.1,
      16384,
      "llama-v3p1-405b-instruct",
      "chat"
    );
    console.log("for caption",suggestions);
    setCaption(suggestions);
    setSuggestions([]);
  
    // Add your logic here (e.g., sending the caption)
  };
  const handlePost = async () => {
    setUploading(true);
    try {
      const file = fileList[0];
      const storage = getStorage();
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file.originFileObj);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const postRef = collection(db, "users", user.uid, "posts");
      await addDoc(postRef, {
        mediaUrl: downloadURL,
        caption: caption,
        username:user.displayName,
        profile:user.photoURL,
        uid:user.uid,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        type: file.type.startsWith('video') ? 'video' : 'image'
      });

      message.success('Post uploaded successfully!');
      localStorage.removeItem('cachedPosts');
      // Reset counter to 0 instead of incrementing
      sethomereload(0);
      settrigger((i)=>i+1);
      setModalVisible(false);
      setFileList([]);
      setCaption('');
    } catch (error) {
      message.error('Upload failed');
    }
    setUploading(false);
  };

  return (
    <>
      <Modal
        title="Create New Post"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="post"
            className='bg-violet-500 hover:bg-violet-600 text-white'
            onClick={handlePost}
            loading={uploading}
          >
            Post
          </Button>
        ]}
      >
        <div className='flex flex-col items-center justify-center w-full min-h-[300px]'> 
          <div className='w-full max-w-md'>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
          {fileList.length === 0 && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Photo/Video</div>
            </div>
          )}
        </Upload >
        <div style={{ position: "relative", marginTop: 16 }}>
      <Input.TextArea
        placeholder="Write caption using AI"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={4}
        style={{ paddingRight: 40 }} // Add space for the icon
      />
      <WandSparkles
        onClick={caption? handleIconClick : null}
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          fontSize: 20,
          cursor: caption? "pointer" : "not-allowed",
          color: caption? "#7f07cf" : "gray",
        }}
      />
    </div>
    </div>
    </div>
      </Modal>
      <button 
       className='bg-gradient-to-r from-violet-400 to-purple-500 text-white font-medium
                  py-2 px-4 rounded-full text-sm
                  transition-all duration-200 ease-in-out shadow-md
                  hover:shadow-violet-200 hover:scale-102
                  flex items-center justify-center gap-2 max-w-[140px] mx-auto'
        onClick={() => setModalVisible(true)}
      >
        Upload Post
      </button>
    </>
  )
}
