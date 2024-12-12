import React, { useState,useEffect } from 'react'
import { Upload, Button, Input, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { db } from '@/config/firebase'
import { ref, uploadBytes, getDownloadURL,getStorage } from 'firebase/storage'
import { doc, setDoc, Timestamp ,getDoc} from 'firebase/firestore'
import { useContext } from 'react'
import UserContext from './context/context'
import { WandSparkles } from 'lucide-react'
import ai from '@/hooks/ai'
import GroupContext from './context/GroupContext'
import { sendNotification } from '@/utils/notificationUtils'
export const Story = ({ onclose }) => {
  const [fileList, setFileList] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const { user } = useContext(UserContext)
  const {users}=useContext(GroupContext);
  const { suggestions, loading, error, fetchSuggestions,setSuggestions } = ai();
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewUrl(file.url || file.preview)
  }
  useEffect(() => {
    if (suggestions) {
      setCaption(suggestions);
    }
  }, [suggestions]);
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    if (newFileList.length > 0) {
      handlePreview(newFileList[0])
    } else {
      setPreviewUrl('')
    }
  }

  const handleIconClick = async() => {
    console.log("Icon clicked! Caption:", caption);
   
   fetchSuggestions(
      `Transform this text into a two-line Instagram story caption with emojis:
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
  
    setSuggestions([]);
  
    // Add your logic here (e.g., sending the caption)
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const uploadStory = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload')
      return
    }

    setUploading(true)
    try {
      const file = fileList[0].originFileObj
      const storage = getStorage();
      const storyRef = ref(storage, `stories/${user.uid}/${Date.now()}-${file.name}`)
      
      await uploadBytes(storyRef, file)
      const mediaUrl = await getDownloadURL(storyRef)
      
      const currentTime = Timestamp.now()
      const expiryTime = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))

      await setDoc(doc(db, "stories", user.uid), {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        mediaUrl,
        caption,
        timestamp: currentTime,
        expiryTime,
        mediaType: file.type.startsWith('video') ? 'video' : 'image'
      })

      message.success('Story uploaded successfully!')
      onclose()
      for (const user1 of users) {
        const recipientDoc = await getDoc(doc(db, "users", user1.uid));
        const recipientFcmToken = recipientDoc.data().fcmToken;
        console.log(" sharing user recipientFcmToken",recipientFcmToken);
        // Send notification
        if (recipientFcmToken) {
          await sendNotification(recipientFcmToken, `${user.displayName}: has posted a new story`,user.uid,user.displayName,user.photoURL);
        }
     }
    } catch (error) {
      console.error('Error uploading story:', error)
      message.error('Failed to upload story')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add New Story</h3>
      
      <Upload.Dragger
        accept="image/*,video/*"
        beforeUpload={() => false}
        onChange={handleChange}
        fileList={fileList}
        maxCount={1}
        className="mb-4"
      >
        {previewUrl ? (
          <div className="relative w-full aspect-square max-h-[300px] overflow-hidden">
            {fileList[0]?.type?.startsWith('video') ? (
              <video 
                src={previewUrl} 
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : (
          <div className="p-8">
            <UploadOutlined className="text-2xl mb-2" />
            <p className="text-gray-600">Click or drag file to upload</p>
          </div>
        )}
      </Upload.Dragger>
      <div style={{ position: "relative", marginTop: 16 }}>
  <Input.TextArea
    placeholder="Write a caption..."
    value={caption}
    onChange={(e) => setCaption(e.target.value)}
    className="mb-4"
    rows={3}
    style={{ paddingRight: 40 }} // Added padding to prevent text overlap with icon
  />
  <WandSparkles
    onClick={caption ? handleIconClick : null}
    style={{
      position: "absolute",
      bottom: 27, // Added bottom positioning to align with text area
      right: 8,
      fontSize: 20,
      cursor: caption ? "pointer" : "not-allowed",
      color: caption ? "#7f07cf" : "gray",
    }}
  />
</div>

      <Button 
       
        block 
        onClick={uploadStory}
        loading={uploading}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:violet-600  text-black"
      >
        Share Story
      </Button>
    </div>
  )
}
