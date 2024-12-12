import React, { useEffect, useState,useContext,useMemo } from 'react'
import {Flex, Typography, Space} from 'antd';
import { AudioOutlined,SendOutlined,UploadOutlined,FileImageOutlined ,SmileOutlined,LoadingOutlined,ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Popover,Modal,Form,Input,Select,message,Upload,Progress,Image,Empty,Tooltip} from 'antd';
import { MessageCircleReply } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ChatOptions } from './ChatOptions';
import { ChatThemes } from './ChatThemes';
import { CustomInput } from './CustomInput';
import { Message } from './Message';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { QuerySnapshot, addDoc, collection, onSnapshot,doc,updateDoc,getDocs,arrayUnion,getDoc, deleteDoc } from 'firebase/firestore';
import {db} from '../config/firebase'
import UserContext from './context/context';
import  ChatContext, { useChat } from './context/ChatContext';
import { WelcomeTemplate } from './WelcomeTemplate';
import { ImagePlay,SmilePlus,Video,WandSparkles } from 'lucide-react';
import GroupContext  from './context/GroupContext';
import { Group } from './Group';
import { Profilecard } from './Profilecard';
import GroupDetails from './GroupDetails';
import { ShowGroup } from './ShowGroup';
import ai from '../hooks/ai';
import { Ai } from './Ai';
import { sendNotification } from '../utils/notificationUtils';
import { Videocall } from './Videocall';
import { EmptyChat } from './EmptyChat';
import ScrollToTop from './Design/Scroll-to-top';
export const PersonalChat= ({onBack}) => {
    const { user } = useContext(UserContext);
    const {targetuserid} =useContext(ChatContext);
    const [load,setload]=useState(false)
    const [allUsers, setAllUsers] = useState([]);
    const {personalChats,cname,cimg,cemail}=useChat()
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [messages,setmessages]=useState([]);
 const navigate=useNavigate();
  const {email,photoURL,displayName,}=user
  const [text,settext]=useState('');
  const [del,setdel]=useState(false);
  const {group,users,setisgroup,groupid,groupname,grouplogo,groupdescription,setdraw,draw,settest,test,videocall,setvideocall}=useContext(GroupContext)
  const messageref=collection(db,"messages")
  const [messageApi, contextHolder] = message.useMessage();
  const usergroup = collection(db,"Groupusers");
  const [fileUrl, setFileUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const[load1,setload1]=useState(false);
const [isThemeDrawerVisible, setIsThemeDrawerVisible] = useState(false);
const [chatBackground, setChatBackground] = useState('#ffffff');
const { suggestions, loading, error, fetchSuggestions,setSuggestions } = ai();
const [messageTheme, setMessageTheme] = useState({
  msgRight: '#8A4FFF', // Rich purple that's easy on the eyes
  msgLeft: '#EFEFEF'   // Soft gray that maintains readability
});

 const chats = useMemo(() => {
  if (personalChats) {
    setload(true)
  
    const userDocRef = doc(db, "chatusers",personalChats );
    const chatRoomSubColRef = collection(userDocRef, "chatroom");
   
    return chatRoomSubColRef;
  }
  return null;
}, [personalChats,group]);

useEffect(() => {
  let unsub;

    if(group==='allowchat'){
    
    unsub = onSnapshot(messageref, (QuerySnapshot) => {
      const newMessages = QuerySnapshot.docs.map((doc) => doc.data()).sort((a, b) => a.date - b.date);
      setReplyTo(false)

      setmessages(newMessages);
      setload(false)
      
    });
  }
  else if(group==='group'){
    if(groupid){
      const usergroup = collection(db,"Groupusers");    
      const groupDoc = doc(usergroup, groupid);
      const groupChatsRef = collection(groupDoc, "groupchats");
    
    
    unsub = onSnapshot(groupChatsRef, (QuerySnapshot) => {
      const newMessages = QuerySnapshot.docs.map((doc) => doc.data()).sort((a, b) => a.date - b.date);
      setReplyTo(false)
      setmessages(newMessages)
      setload(false)
      
    });
    }
  }
  
  else{
    if (chats) {
      //console.log("database dm reference",chats);
    unsub = onSnapshot(chats, (QuerySnapshot) => {
      const newMessages = QuerySnapshot.docs.map((doc) => doc.data()).sort((a, b) => a.date - b.date);
      setReplyTo(false)
     // console.log("newMessages",newMessages);
      setmessages(newMessages);
      
      setload(false)
      
    });
  }
  }

  return () => {
    if (unsub) {
      unsub(); // Clean up subscription if it was created
    }
  };
}, [chats,group,groupid]);
useEffect(() => {
  const auto=()=>{
    const timer = setTimeout(() => {
      if (text) {
      fetchSuggestions(`Complete the following text with 4-5 additional words:
"${text}"
Completion:`,0.5,10,"llama-v3p1-405b-instruct","completion");
      } else {
        setSuggestions('');
      }
    }, 300);
    return () => clearTimeout(timer);
  }
  const up = async () => {
    if (user && user.uid) {
      const userRef = doc(db, 'users', user.uid);
      console.log("typing update");
      try {
        await updateDoc(userRef, {
          typing: text.trim().length > 0
        });
     
        // Fetch all users
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllUsers(usersData);
        // console.log('All users fetched and stored in state',allUsers);
      } catch (error) {
        console.error('Error updating typing or fetching users:', error);
      }
    }
  };
 
  auto();
  up();
  settest(test+1);
}, [text]);
const handleKeyDown = (e) => {
  if (e.key === 'Tab' && suggestions.length > 0) {
    e.preventDefault();
    const suggestionsString = suggestions[0].replace(/"/g, "");

    const newWords = suggestionsString.slice(text.length).trim();
    settext(text + newWords);
    setSuggestions([]);
  }
};

const sendEmail = (e) => {
  console.log(cemail)
  const emailData = {
    from_name: user.displayName, 
    to_name: cname,        
    to_email: cemail,    
    message:`${user.displayName} messaged you ${text}`,     
  };

  emailjs
    .send('service_qjgeqdg', 'template_7vpkhnb', emailData, {
      publicKey: 'THMt6XLtnjN3YEKw9',
    })
    .then(
      () => {
        console.log('SUCCESS!');
      },
      (error) => {
        console.log('FAILED...', error.text);
      },
    );
};
const date = new Date();

const dateString = date.toISOString().split('T')[0];

// Format the time in 12-hour format with 'HH:MM AM/PM'
let hours = date.getHours();
let minutes = date.getMinutes();
const period = hours >= 12 ? 'PM' : 'AM';

if (hours > 12) {
    hours -= 12;
} else if (hours === 0) {
    hours = 12;
}

const timeString = `${hours}:${minutes} ${period}`;

// Extract day and time
const day = dateString; // 'YYYY-MM-DD'
const time = timeString; // 'HH:MM AM/PM'

// console.log("Day:", day);
// console.log("Time:", time);
const handlesubmit = async (s) => {
  const ur=s?s:text;
  console.log("passed valuer",ur);
  const hasnewmsgref = doc(db, "users", targetuserid);

 
  sendEmail()
  
  
    if (group==='allowchat'){
      await addDoc(messageref, {
        text:ur ,
        email: email,
        logo: photoURL,
        name: displayName,
        day,
        time,
        date
      });
    }
    else if(group==='group'){
      if (groupid){
        const usergroup = collection(db,"Groupusers");    
      const groupDoc = doc(usergroup, groupid);
      const groupChatsRef = collection(groupDoc, "groupchats");
    
      await addDoc(groupChatsRef, {
        text:ur,
        email: email,
        logo: photoURL,
        name: displayName,
        day,
        time,
        date
      });
    
    }
    }
    else{
if (chats) {
    await addDoc(chats, {
      text:ur,
      email: email,
      logo: photoURL,
      name: displayName,
      day,
      time,
      date
    });
    const sound = new Audio("/msg.mp3");
    sound.volume = 0.2; // Sets volume to 20%
    sound.play();
    
    await updateDoc(hasnewmsgref, {
      newMessages: arrayUnion(user.uid), // Add sender's ID to array
      hasnewmessage: true
    });
    sendnotify(ur);
  
   
  }
}
  settext('');
};
const sendnotify= async(ur)=>{
  console.log("called");
  const recipientDoc = await getDoc(doc(db, "users", targetuserid));
  const recipientFcmToken = recipientDoc.data().fcmToken;
  console.log("recipientFcmToken",recipientFcmToken);
  // Send notification
  if (recipientFcmToken) {
    await sendNotification(recipientFcmToken, `New message from ${user.displayName}: ${ur}`,user.uid,user.displayName,user.photoURL);
  }
}


const scrollToBottom = () => {
  const msgContainer = document.getElementById('msg-container1');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
};


 const handlePopoverOpen = () => {
  setPopoverVisible(true);
};
const [replyTo, setReplyTo] = useState(null);

  const handleReply = (text, name) => {
    setReplyTo({ text, name});
    // scrollToBottom()
  };
  const handleSetdel = () => {
    setdel(true);
   
  };

const handleEmojiClick = (emojiData, event) => {
 
  const selectedEmoji = emojiData.emoji;


  console.log("Selected Emoji:", selectedEmoji);


  settext(i=>i+selectedEmoji)
};



  const showModal2 = () => setIsModalVisible(true);

  const handleCancel3 = () => {
    setIsModalVisible(false);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, 'images/' + selectedFile.name);
     
      try {
        setload1(true);
        // Upload file
        const snapshot = await uploadBytes(storageRef, selectedFile);
        
       
        const url = await getDownloadURL(snapshot.ref);
        
        // Set the URL in state
        setFileUrl(url);
        
        console.log(`File uploaded and link generated: ${url}`);
        
        handlesubmit(url);
        setload1(false);
         
        handleCancel3();
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };
  
  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      setSelectedFile(file);
      // Immediately create and set the image URL
      const imageUrl = URL.createObjectURL(file);
    
      setImagePreview(imageUrl);
    }
  };
 
const suffix = (
    <>
    <Ai text={text} settext={settext} />
    
    <Tooltip placement='top' title="Send Image"><ImagePlay onClick={showModal2} style={{fontSize: 18,cursor:"pointer"}}  className='text-violet-500'/></Tooltip>
    <Modal
  title="Select and Send Image"
  open={isModalVisible}
  onCancel={handleCancel3}
  footer={null}
  width={450}
>
  <div className="flex flex-col items-center">
    <div className="mb-4 w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      {imagePreview ? (
        <Image
          preview={false}
          src={imagePreview}
          alt="Selected file"
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <Empty />
      )}
    </div>
    <div className="w-full flex justify-center items-center gap-2">
      <Upload
        accept="image/*"
        showUploadList={false}
        onChange={handleFileChange}
      >
        <Button className='' icon={<UploadOutlined />} size="large">Select File</Button>
      </Upload>
      {selectedFile && (
        <Button 
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          size="large"
        >
          {!load1 ? <Typography.Text  style={{color:"white"}}>Send</Typography.Text>:<LoadingOutlined className='animate-spin'/>}
        </Button>
      )}
    </div>
  </div>
</Modal>

         <Popover content={ <><a className='side' onClick={()=>setPopoverVisible(false)}>❌</a><Space/>
         <EmojiPicker  onEmojiClick={handleEmojiClick}searchDisabled  height={300}/></>}
      placement="leftTop"
      trigger="click"
      open={popoverVisible}
      onOpenChange={handlePopoverOpen}
    > 
      <Tooltip placement='top' title="emoji"><SmilePlus 
          style={{
            fontSize: 18,
            
            cursor:"pointer"
          }}
          className='text-violet-500'
        />
        </Tooltip>
    </Popover>
    </>  
  );
  useEffect(() => {
   
    scrollToBottom();
    
  
   }, [messages,replyTo,personalChats, group]);
   
   
   const [isModalOpen1, setIsModalOpen1] = useState(false);
   const [isModalOpen2, setIsModalOpen2] = useState(false);


  const showgroup=()=>{
    setIsModalOpen2(true);
  }
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
 
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
 
    const showprofile=()=>{
      showModal1();
    }
    const calldrawer=()=>{
      console.log('drawer')
      setdraw(true)
     
    }
  
  


  
  const handleChange = (e) => {
    settext(e.target.value);
  
  };

  const handleSearch = (value) => {
    settext('');
    handlesubmit("");
  };
 
 const navivideo= async (diff)=>{
  if(diff==1){
    navigate('/Videocall')
    await addDoc(chats, {
      text:"You Requested a Video Call",
      email: email,
      logo: "https://icon-library.com/images/iphone-call-icon/iphone-call-icon-28.jpg",
      name: displayName,
      call:true,
      day,
      time,
      date
    });
   
    const recipientDoc = await getDoc(doc(db, "users",targetuserid));
    const recipientFcmToken = recipientDoc.data().fcmToken;
    console.log(" sharing user recipientFcmToken",recipientFcmToken);
    // Send notification
    if (recipientFcmToken) {
      await sendNotification(recipientFcmToken, `${user.displayName}: has requested you a Video Call`,user.uid,user.displayName,user.photoURL);
    }
  }
 }
 const handleDeleteChat =  async() => {
  Modal.confirm({
    title: 'Delete Chat',
    content: 'Are you sure you want to delete this chat? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      const chatRoomDocs = await getDocs(chats);
      const deletePromises = chatRoomDocs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log("Subcollection 'chatroom' deleted successfully.");
      message.success('Chat deleted');
    }
  });
};



const handleThemeSelect = (color) => {
  setChatBackground(color);
  // setMessageTheme({
  //   msgRight: getMatchingDarkColor(color),
  //   msgLeft: '#FFFFFF'
  // });
  message.success('Theme applied');
};
return (
  <div className="h-screen">
    {/* Welcome Template for initial state */}
    {(group !== 'allowchat' && !personalChats && group !== 'group') && (
      <WelcomeTemplate />
    )}

    {/* Main Chat Interface */}
    {(group === 'allowchat' || personalChats || group === 'group') && (
      <div className="h-full flex flex-col">
        {/* Profile Modal */}
        <Modal 
          title="Profile" 
          open={isModalOpen1} 
          footer={null} 
          onCancel={handleCancel1}
        >
          <Profilecard />
        </Modal>

        {/* Members Modal */}
        <Modal 
          title="All Members" 
          open={isModalOpen2} 
          footer={null} 
          onCancel={handleCancel2}
        >
          <ShowGroup />
        </Modal>

        {/* Group Details Drawer */}
        {draw && <GroupDetails />}

        {/* Chat Container */}
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="p-4 flex items-center justify-between">
              {/* Mobile Back Button */}
              <div className="md:hidden">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                  <MessageCircleReply className="text-xl text-black" />
                </button>
              </div>

              {/* Header Content Based on Chat Type */}
              {group !== 'allowchat' && group !== 'group' ? (
                <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-lg p-2 md:p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={cimg}
                      onClick={showprofile}
                      className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                      alt="Profile"
                    />
                    <div>
                      <h3 className="text-lg font-medium capitalize">{cname}</h3>
                      <div className="typing-indicator">
                        {allUsers.map(user => 
                          user.typing && user.uid !== user.uid && (
                            <p key={user.uid} className="text-sm text-gray-500 animate-pulse">
                              Typing...
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                  <Tooltip title="Video Call" placement="top">
                    <Video 
                      className="w-6 h-6 cursor-pointer text-gray-600 hover:text-violet-500" 
                      onClick={() => navivideo(1)}
                    />
                    </Tooltip>
                  
                    <ChatOptions
                      onDelete={handleDeleteChat}
                      onSettings={() => setIsThemeDrawerVisible(true)}
                      onReport={() => message.info('Report submitted')}
                    />
                  
                    <ChatThemes 
  visible={isThemeDrawerVisible}
  onClose={() => setIsThemeDrawerVisible(false)}
  onThemeSelect={handleThemeSelect}
/>
                  </div>
                </div>
              ) : group === 'group' ? (
                <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={calldrawer}>
                    <img
                      src={grouplogo}
                      className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-500"
                      alt="Group"
                    />
                    <span className="text-lg font-medium">{groupname}</span>
                  </div>
                  <button className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50"  onClick={calldrawer}>
                    Leave Group
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={showgroup}>
                    <Group className="w-8 h-8 text-blue-500" />
                    <span className="text-lg font-medium">Community Chat</span>
                  </div>
                  <button 
                    onClick={() => navivideo(1)}
                    className="flex items-center gap-2 px-4 py-2  text-violet-500 rounded-lg hover:text-violet-600"
                  >
                    <Video className="w-5 h-5" />
                   
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-hidden flex flex-col">
  <div
    id="msg-container1"
    style={{ backgroundColor: chatBackground }}
    className="flex-1 overflow-y-auto px-4 pb-2 relative"
  >
      <div className="absolute w-full h-full">
    {/* Message content */}
    {messages.length === 0 ? (
  <EmptyChat/>
) : (
  load ? (
    <LoadingOutlined 
      style={{ 
        color: '#8A4FFF', 
        fontSize: '30px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }} 
    />
  ) : (
    <div className="msg pb-4" id="msg">
    
      {messages
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((msg, index) => (
          <Message
            key={index}
            msglen={messages.length}
            handleReply={handleReply}
            msg={msg}
            id1={index}
            messageTheme={messageTheme}
          />
        ))}
    </div>
  )
)}
</div>

</div>
<div className="w-full">
  {/* Reply Interface */}
  {replyTo && (
    <div className="bg-gray-50 border-t border-gray-200 p-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Replying to {replyTo.name}</span>
        <button
          onClick={() => setReplyTo(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ❌
        </button>
      </div>
      <p className="text-gray-500 truncate mt-1">{replyTo.text}</p>
    </div>
  )}
  </div>
  {/* Input Area */}
  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
    <CustomInput
      value={text}
      suffix={suffix}
      onChange={handleChange}
      onSearch={(value) => {
        if (value.trim()) {
          handleSearch(value);
        }
      }}
      suggestion={suggestions}
      onKeyDown={handleKeyDown}
      className="w-full"
    />
  </div>
</div>
        </div>
      </div>
    )}
  </div>
);


};