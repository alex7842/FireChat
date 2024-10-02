import React,{useContext,useState} from 'react'
import UserContext from './context/context';
import  { useChat } from './context/ChatContext';
import { db } from '../config/firebase';
import { collection,doc, deleteDoc,query,where,getDocs } from 'firebase/firestore';
import {ShareAltOutlined,DeleteOutlined,InfoCircleOutlined ,RollbackOutlined } from '@ant-design/icons'
import {  Flex, Popover,message,Image } from 'antd';
import GroupContext from './context/GroupContext';

export const Message = ({msglen,id1,text,logo,email,day,time,date,handleReply,name}) => {
  const {UserId}=useChat()
  // console.log(text)
  const {group}=useContext(GroupContext)
  

 
  
  const [messageApi, contextHolder] = message.useMessage();

 function handleclick(d,msgid){
 
  const messageBox = document.getElementById(`msgr-${msgid}`);
    messageBox.textContent = d; // Use textContent to set text, not innerHTML for security reasons
  
 }
 let t;
 const handleheight=()=>{
  if(id1==msglen-1){
     t=document.getElementById(`message-right-${id1-1}`)
   
  }
  else{
     t=document.getElementById(`message-right-${id1+1}`)
  }
  const k= t.getBoundingClientRect().bottom;
  const h=height-k
  t.scrollIntoView({ behavior: 'smooth', block: 'end'});
  t.style.marginTop=`${h}px`

 }

 const handleDelete = async () => {
  try {
    
    // Reference to the chatroom collection for the given userId
    let chatRoomRef;

    // Reference to the chatroom collection based on the group
    if (group === 'allowchat') {
        chatRoomRef = collection(db, "messages");
    } else {
        chatRoomRef = collection(db, "chatusers", UserId, "chatroom");
    }


   
   // Query to find documents matching the message content
   const q = query(chatRoomRef, where("date", "==", date));
      
   // Execute the query
   const querySnapshot = await getDocs(q);
   
    
    // Check if any documents were found
    if (!querySnapshot.empty) {
      // Loop through the documents and delete them
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref); // Delete the document
      });
      console.log('Message(s) deleted successfully.');
      //handleheight();
    
      messageApi.info('Message Deleted Sucessfully!');
    
    } else {
      console.log('No message found with the given content.');
    }
  } catch (error) {
    console.log(error)
    // messageApi.open({
    //   type: 'error',
    //   content: 'Error deleting Message',
 
    // });
  }
};

 const handleinfo=()=>{
  const f=document.getElementById(`info-${id1}`);
  f.style.display='block'
  f.style.color='#040404'
  f.textContent=`${day} ${time}`
 }


 const handleDemojiClick = (messageId) => {
  const mbox = document.getElementById(`msgr-${messageId}`);
 
  if (mbox.textContent) {
    mbox.textContent = ''; // Remove the value if it contains any
  }
};
const formatTime = (time) => {
  const [timePart, period] = time.split(' ');
  const [hours, minutes] = timePart.split(':');


  const formattedMinutes = parseInt(minutes, 10).toString().padStart(2, '0');

  return `${hours}:${formattedMinutes} ${period}`;
};
  const { user } = useContext(UserContext);
  const emoji=[ '❤️', '😂' ,'😁' ,'👍' ,'😊', '🤣']
 
  const content = (
    <div>
       {contextHolder}
      
      <p > {emoji.map((data,index)=><span  onClick={()=>handleclick(data,id1)} key={index} className='emoj'>{data}</span>)}</p>
      <p  style={{cursor:'pointer'}} onClick={() => handleReply(text,name )}><RollbackOutlined /> Reply</p>
      <p  style={{cursor:'pointer'}}><ShareAltOutlined /> Forward</p>
      
      <p  style={{cursor:'pointer'}} onClick={handleDelete}><DeleteOutlined /> Delete</p>
      
      <p  onClick={handleinfo} style={{cursor:'pointer'}}><InfoCircleOutlined /> Info</p>
      <span id={`info-${id1}`} style={{display:'none'}}></span>
    </div>
  );
  
  return (
  <>
  <div className='d-flex justify-content-center' style={{color:'#8A8A8A'}}>{day}</div>
    <div className={`d-flex ${email===user.email && 'justify-content-end' }`}>
      
{
user.email===email ?(
  
  
  <Popover placement="right" title='React' content={content}>
   
   <span  className={text.startsWith("https://firebasestorage.googleapis.com") ?'w-80 rounded-lg border-black-2 py-2 mr-3':'message-right'} id={`message-right-${id1}`} >
  
   {contextHolder}
    <Flex vertical>
    <Flex>
 
      {text.startsWith("https://firebasestorage.googleapis.com") ?(
        <div className='w-90'>
       
          <Image src={text} alt="uploaded" className='uploaded-image'/>
        </div>
      ) : (
        <>
           <img src={user.photoURL} className='logo-icon'/>
      
        <span className='message-text'>{text}</span>
        </>
      )}
     
    </Flex>
       <Flex justify='space-between'>
       <span className='demoji' id={`msgr-${id1}`} onClick={() => handleDemojiClick(id1)}></span>
        <Flex >
        <span style={{color:''}}>{formatTime(time)}</span>
     
     
        </Flex>
       
        
        </Flex>
       
        
        </Flex>
   </span>
     </Popover>
   
):(
  <Popover placement="right" title='React' content={content}>
  <span  className={text.startsWith("https://firebasestorage.googleapis.com") ?'w-80 rounded-lg border-black-2 py-2 mr-3':'message-left'} id={`message-left-${id1}`} >
  
  {contextHolder}
   <Flex vertical>
   <Flex>
  
     {text.startsWith("https://firebasestorage.googleapis.com") ?(
       <div className='w-90'>
      
         <Image src={text} alt="uploaded" className='uploaded-image'/>
       </div>
     ) : (
      <>
      <img src={logo} className='logo-icon'/>
 
   <span className='message-text'>{text}</span>
   </>
     )}
    
   </Flex>
      <Flex justify='space-between'>
      <span className='demoji' id={`msgr-${id1}`} onClick={() => handleDemojiClick(id1)}></span>
       <Flex >
       <span style={{color:''}}>{formatTime(time)}</span>
    
    
       </Flex>
      
       
       </Flex>
      
       
       </Flex>
  </span>
   </Popover>
)
}

        
    </div>
    
    </>
  )
}
