import React, { useEffect, useState,useContext,useMemo } from 'react'
import {Flex, Typography, Space} from 'antd';
import { AudioOutlined,SendOutlined,UploadOutlined,FileImageOutlined ,SmileOutlined,LoadingOutlined } from '@ant-design/icons';
import { Button, Popover,Modal,Form,Input,Select,message,Upload,Progress,Image,Empty} from 'antd';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { CustomInput } from './CustomInput';
import { Message } from './Message';
import emailjs from '@emailjs/browser';

import EmojiPicker from 'emoji-picker-react';
import { QuerySnapshot, addDoc, collection, onSnapshot,doc,updateDoc,getDocs } from 'firebase/firestore';
import {db} from '../config/firebase'
import UserContext from './context/context';
import  { useChat } from './context/ChatContext';
import { WelcomeTemplate } from './WelcomeTemplate';
import { ImagePlay,SmilePlus,Video,WandSparkles } from 'lucide-react';
import GroupContext  from './context/GroupContext';
import { Group } from './Group';
import { Profilecard } from './Profilecard';
import GroupDetails from './GroupDetails';
import { ShowGroup } from './ShowGroup';
import ai from '../hooks/ai';
import { Ai } from './Ai';
import { Videocall } from './Videocall';
export const PersonalChat= () => {
    const { user } = useContext(UserContext);
    const [load,setload]=useState(false)
    const [allUsers, setAllUsers] = useState([]);
    const {personalChats,cname,cimg,cemail}=useChat()
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [messages,setmessages]=useState([]);
 
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

const { suggestions, loading, error, fetchSuggestions,setSuggestions } = ai();
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
//       if (text) {
//       fetchSuggestions(`Complete the following text with 4-5 additional words:
// "${text}"
// Completion:`,0.5,10,"llama-v3p1-405b-instruct","completion");
//       } else {
//         setSuggestions('');
//       }
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
// console.log(date); // Output the current date and time

// Format the date as a string in 'YYYY-MM-DD' format
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
 // sendEmail()
  
  
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
   
  }
}
  settext('');
};


 const scrollToBottom = () => {
  const msgContainer = document.getElementById('msg');
  if (msgContainer) {
    msgContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  
}

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
    
    <ImagePlay onClick={showModal2} style={{fontSize: 18, color: '#1677ff',cursor:"pointer"}} />
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
    <div className="w-full flex justify-between items-center">
      <Upload
        accept="image/*"
        showUploadList={false}
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />} size="large">Select File</Button>
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
      <SmilePlus 
          style={{
            fontSize: 18,
            color: '#1677ff',
            cursor:"pointer"
          }}
        />
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
  // if(videocall){
  //   return <Videocall/>
  // }
 
   return (
    <div style={{ border: 'none' }}>
      {(group !== 'allowchat' && !personalChats && group!=='group' ) && <WelcomeTemplate />}
  
      {(group === 'allowchat' || personalChats || group==='group') && (
        <div>
        

       
      <Modal title="Profile" open={isModalOpen1}  footer={[
        
      ]} onCancel={handleCancel1}>
        <Profilecard/>
        </Modal>
      
      <Modal title="All Members" open={isModalOpen2}  footer={[
        
      ]} onCancel={handleCancel2}>
      <ShowGroup/>
        </Modal>
      
        
      {draw && <GroupDetails   />}

          { group !== 'allowchat' && group!=='group'?
           <Flex  id='new'align="center" style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }} onClick={showprofile}  gap={4}>
           <img src={cimg}  style={{ borderRadius: '50%', width: '5%', height: '5%' }} alt="Chat Avatar" />
           <Flex vertical>
           <Typography.Text style={{ fontSize: 34 }}>{cname}</Typography.Text>
          
           {allUsers.map((i) => 
    i.typing && i.uid!=user.uid  && (
      <p key={user.uid}>Typing...</p>
    )
  )}

  
          </Flex>
          <div className="ml-9 " onClick={()=>setvideocall(true)}><Video/>Video Call</div>
         </Flex>:group==='group'?

         <Flex  onClick={calldrawer} align="center" justify='space-between' style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }} gap={4}>
          <Flex align='center' >
          <img   src={grouplogo} style={{ borderRadius: '50%', width: '5%', height: '5%' }} alt="Chat Avatar" />
       
           <Flex vertical>
          <Typography.Text style={{ fontSize: 34 }}>{groupname}</Typography.Text>
          
          {allUsers.map((i) => 
    i.typing && i.uid!=user.uid  && (
      <p key={user.uid}>{i.displayName} is Typing...</p>
    )
  )}
          </Flex>
           </Flex>
           <Button>Leave Group</Button>
           {contextHolder}
           
         </Flex>:
         <Flex align="center" justify='space-between' style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }}  gap={4}>
          <Flex onClick={showgroup}  align='center' justify='center'>
          
         <Group/>
         <Flex vertical>
           <Typography.Text style={{ fontSize: 28 }}>Community Chat</Typography.Text>
           {allUsers.map((i) => 
    i.typing && i.uid!=user.uid  && (
      <p key={user.uid}>{i.displayName} is Typing...</p>
    )
  )}
          </Flex>
         
           </Flex>
           {contextHolder}
         
         </Flex>
        
}
   
        <div className="child">
          <div id="msg-container1" className="msg-container1">
          {load ? (
            <LoadingOutlined style={{ color: '#00ccff', fontSize: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
          ) :
            <div className="msg" id="msg">
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  msglen={messages.length}
                  handleReply={handleReply}
                  {...msg}
                  id1={index}
                 
                />
              ))}
            </div>
}
            {replyTo && (
              <div id={`reply`} className="reply" style={{ display: 'block' }}>
                <span>Replying to {replyTo.name}</span>
                <span
                  style={{ cursor: "pointer", marginLeft: '600px', fontSize: '22px' }}
                  onClick={() => setReplyTo(false)}
                >
                  ❌
                </span>
                <p style={{ color: '#707070' }}>{replyTo.text}</p>
              </div>
            )}
           
          </div>
  
            {/* <Input.Search
              placeholder="Type here"
              enterButton="Send"
              style={{ border: '1px solid black' }}
              size="large"
              suffix={suffix}
              value={text}
              onChange={(e) => settext(e.target.value)}
              onKeyDown={handleKeyDown}
              addonAfter={text}
              onSearch={(value) => {
                settext('');
                handlesubmit("");
              }}
            /> */}
          <div id="child1" className="child1" >
             <CustomInput
      value={text}
      suffix={suffix}
      onChange={handleChange}
      onSearch={handleSearch}
      suggestion={suggestions}
      onKeyDown={handleKeyDown}
    />
          </div>
        </div>
    </div>
      )}
      <span id='pls'></span>
    </div>
  );
  
};