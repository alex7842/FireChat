import React, { useEffect, useState,useContext,useMemo } from 'react'
import {Flex, Typography, Space} from 'antd';
import { AudioOutlined,SendOutlined,UploadOutlined,FileImageOutlined ,SmileOutlined,LoadingOutlined } from '@ant-design/icons';
import { Button, Popover,Modal,Form,Input,Select,message,Upload,Progress,Image,Empty} from 'antd';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


import { Message } from './Message';
import emailjs from '@emailjs/browser';

import EmojiPicker from 'emoji-picker-react';
import { QuerySnapshot, addDoc, collection, onSnapshot,doc } from 'firebase/firestore';
import {db} from '../config/firebase'
import UserContext from './context/context';
import  { useChat } from './context/ChatContext';
import { WelcomeTemplate } from './WelcomeTemplate';

import GroupContext  from './context/GroupContext';
import { Group } from './Group';
import { Profilecard } from './Profilecard';
import GroupDetails from './GroupDetails';
import { ShowGroup } from './ShowGroup';
export const PersonalChat= () => {
    const { user } = useContext(UserContext);
    const [load,setload]=useState(false)
    const {personalChats,cname,cimg,cemail}=useChat()
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [messages,setmessages]=useState([]);
  const {email,photoURL,displayName,}=user
  const [text ,settext]=useState('');
  const [del,setdel]=useState(false);
  const {group,users,setisgroup,groupid,groupname,grouplogo,groupdescription,setdraw,draw}=useContext(GroupContext)
  const messageref=collection(db,"messages")
  const [messageApi, contextHolder] = message.useMessage();
  const usergroup = collection(db,"Groupusers");
  const [fileUrl, setFileUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const[load1,setload1]=useState(false);

 const chats = useMemo(() => {
  if (personalChats) {
    setload(true)
    const userDocRef = doc(db, "chatusers", personalChats);
    const chatRoomSubColRef = collection(userDocRef, "chatroom");
   
    return chatRoomSubColRef;
  }
  return null;
}, [personalChats,group]);
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
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
    unsub = onSnapshot(chats, (QuerySnapshot) => {
      const newMessages = QuerySnapshot.docs.map((doc) => doc.data()).sort((a, b) => a.date - b.date);
      setReplyTo(false)
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
        text ,
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
        text,
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
        
        // Get download URL
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
    <FileImageOutlined onClick={showModal2} style={{fontSize: 18, color: '#1677ff'}} />
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
      <SmileOutlined
          style={{
            fontSize: 18,
            color: '#1677ff',
          }}
        />
    </Popover>
    </>  
  );
  useEffect(() => {
   
    scrollToBottom();
    
  
   }, [messages,replyTo,personalChats, group]);
   
   
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalOpen1, setIsModalOpen1] = useState(false);
   const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

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
  const handleCancel = () => {
    setIsModalOpen(false);
  };
    const Creategroup=()=>{
      // messageApi.info('Hello, Ant Design!');
      showModal();
    }
    const showprofile=()=>{
      showModal1();
    }
    const calldrawer=()=>{
      console.log('drawer')
      setdraw(true)
     
    }
  
    const [selectedItems, setSelectedItems] = useState([]);
    const filteredOptions = users.filter((o) => o.uid!==user.uid && !selectedItems.includes(o));
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      setIsModalOpen(false);
   
      try{
      await addDoc(usergroup, {  
       groupname: values['GroupName'],
        logo: 'https://th.bing.com/th/id/OIP.lTpUAgvvRRvPlwWWts2UNwHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5',
        members: [...values['Members'], user.displayName],
       description:values['Description'] || '',
       admin:user.displayName,
        day,
        time,
        date
      });
      setisgroup(true);
      

    }
    catch(e){
      messageApi.error('Error Creating Group');
console.log("Error",e)
    }
    finally{
      messageApi.success('Group Created Successfully');
    }
    
      console.log('Received values of form:',[...values['Members'], user.displayName]);
      
      form.resetFields();
    };
   return (
    <div style={{ border: 'none' }}>
      {(group !== 'allowchat' && !personalChats && group!=='group' ) && <WelcomeTemplate />}
  
      {(group === 'allowchat' || personalChats || group==='group') && (
        <div>
          <Modal title="Basic Modal" open={isModalOpen}  footer={[
        
        ]} onCancel={handleCancel}>
          <Form
    {...formItemLayout}
    form={form}
    variant="filled"
    style={{
      maxWidth: 600,
    }}
    onFinish={onFinish}
  >
    <Form.Item

      label="Group Name"
      name="GroupName"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input />
    </Form.Item>

   

    <Form.Item
      label="Description"
      name="Description"
      rules={[
        {
         
          message: 'Please input!',
        },
      ]}
    >
      <Input.TextArea />
    </Form.Item>

    

    <Form.Item
      label="Select Members"
      name="Members"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
     <Select
      mode="multiple"
      placeholder="Select Members"
      value={selectedItems}
      onChange={setSelectedItems}
      style={{
        width: '100%',
      }}
      options={filteredOptions.map((item) => ({
        value: item.displayName,
        label: ( <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={item.photoURL} alt="Avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }} />
        {item.displayName}
      </div>),
      }))}
    />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
      </Modal>

       
      <Modal title="Profile" open={isModalOpen1}  footer={[
        
      ]} onCancel={handleCancel1}>
        <Profilecard/>
        </Modal>
      
      <Modal title="All Members" open={isModalOpen2}  footer={[
        
      ]} onCancel={handleCancel2}>
      <ShowGroup/>
        </Modal>
      
        
      {draw && <GroupDetails />}

          { group !== 'allowchat' && group!=='group'?
           <Flex  id='new'align="center" style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }} onClick={showprofile}  gap={4}>
           <img src={cimg}  style={{ borderRadius: '50%', width: '5%', height: '5%' }} alt="Chat Avatar" />
           <Typography.Text style={{ fontSize: 34 }}>{cname}</Typography.Text>
          
         </Flex>:group==='group'?

         <Flex  onClick={calldrawer} align="center" justify='space-between' style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }} gap={4}>
          <Flex align='center' >
          <img   src={grouplogo} style={{ borderRadius: '50%', width: '5%', height: '5%' }} alt="Chat Avatar" />
       
          <Typography.Text style={{ fontSize: 34 }}>{groupname}</Typography.Text>
           </Flex>
           <Button>Leave Group</Button>
           {contextHolder}
           
         </Flex>:
         <Flex onClick={showgroup} align="center" justify='space-between' style={{ marginLeft: '2px',backgroundColor:'#D5DBDB' }}  gap={4}>
          <Flex align='center' justify='center'>
          
         <Group/>
          <Typography.Text style={{ fontSize: 28 }}>Community Chat</Typography.Text>
           </Flex>
           {contextHolder}
           <Flex><Button onClick={Creategroup}>Create Group</Button></Flex>
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
  
          <div id="child1" className="child1">
            <Input.Search
              placeholder="input search text"
              enterButton="Send"
              style={{ border: '1px solid black' }}
              size="large"
              suffix={suffix}
              value={text}
              onChange={(e) => settext(e.target.value)}
              onSearch={(value) => {
                settext('');
                handlesubmit("");
              }}
            />
          </div>
        </div>
    </div>
      )}
      <span id='pls'></span>
    </div>
  );
  
};