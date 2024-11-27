import React,{useContext,useState} from 'react'
import UserContext from './context/context';
import  ChatContext, { useChat } from './context/ChatContext';
import { db } from '../config/firebase';
import { collection,doc, deleteDoc,query,where,getDocs,getDoc,updateDoc,arrayUnion,Timestamp } from 'firebase/firestore';
import {ShareAltOutlined,DeleteOutlined,InfoCircleOutlined ,RollbackOutlined } from '@ant-design/icons'
import {  Flex, Popover,message,Image ,Modal,Input} from 'antd';
import GroupContext from './context/GroupContext';
import { Share2,MessageCircle,Heart } from 'lucide-react';
import { PostModal } from './PostModal';
import { Share } from './Share';
export const Message = ({msglen,id1,msg,handleReply,messageTheme}) => {
  const {UserId}=useChat()
const[modelopen,setmodelopen]=useState(false);
  const {group}=useContext(GroupContext)

const {selectedPost,setSelectedPost}=useContext(GroupContext);
 const [ postData,setpostData]=useState(selectedPost);
 const [newComment, setNewComment] = useState('');
 const [likedPosts, setLikedPosts] = useState({});
 const [newsLikes, setNewsLikes] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const[userid,setuserid]=useState("");
 const [Sharemodel,setSharemodel]=useState(false);
  const { user } = useContext(UserContext);
  const emoji=[ '❤️', '😂' ,'😁' ,'👍' ,'😊', '🤣']
  const [SharePost,setSharePost]=useState(null);
  const {targetuserid,settargetuserid}=useContext(ChatContext)
  const [bol, setBol] = useState("");
 function handleclick(d,msgid){
 
  const messageBox = document.getElementById(`msgr-${msgid}`);
    messageBox.textContent = d; // Use textContent to set text, not innerHTML for security reasons
  
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
   const q = query(chatRoomRef, where("date", "==", msg.date));
      
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
  f.textContent=`${msg.day} ${msg.time}`
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

 const content = (
  <div className="min-w-[40px] md:min-w-[120px] py-1 mx-auto text-center">

        {contextHolder}
        
        <div className="px-3 mb-2 border-b border-gray-100">
            {emoji.map((data, index) => (
                <span 
                    onClick={() => handleclick(data, id1)} 
                    key={index} 
                    className="inline-block p-1 hover:bg-violet-100 rounded cursor-pointer transition-colors emoj"
                >
                    {data}
                </span>
            ))}
        </div>

        <div className="space-y-1">
            <div onClick={() => handleReply(msg.text, msg.name)} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 cursor-pointer transition-colors">
                <RollbackOutlined className="text-violet-600" /> 
                <span>Reply</span>
            </div>

            <div  onClick={
              ()=>{
                setSharemodel(true);
                setSharePost(msg)
                 setBol(msg.isNews?"post":"message")
                console.log("bol value",bol)
                console.log(msg)
            }}className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 cursor-pointer transition-colors">
                <ShareAltOutlined className="text-violet-600" /> 
                <span>Forward</span>
            </div>

            <div onClick={handleDelete} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 cursor-pointer transition-colors">
                <DeleteOutlined className="text-red-500" /> 
                <span>Delete</span>
            </div>

            <div onClick={handleinfo} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 cursor-pointer transition-colors">
                <InfoCircleOutlined className="text-violet-600" /> 
                <span>Info</span>
            </div>
        </div>

        <span id={`info-${id1}`} className="hidden"></span>
    </div>
);


  
  
  const handleComment = async () => {
    if (!newComment.trim()) return;
    const post = selectedPost;
     console.log("from comment",post);
    const comment = {
      text: newComment,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      timestamp: Timestamp.now()
    };
  
    try {
      await updateDoc(doc(db, "users", post.uid, "posts", userid), {
        comments: arrayUnion(comment)
      });
      
      setSelectedPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
      setNewComment('');
      messageApi.success('Comment added');
    } catch (error) {
      console.log('Error commenting:', error);
      messageApi.error('Failed to add comment');
    }
  };
  
  const handleNewsComment = async () => {
    if (!newComment.trim()) return;
    const post = selectedPost;
    
    const comment = {
      text: newComment,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      timestamp: Timestamp.now()
    };
  
    try {
      await updateDoc(doc(db, "globalPosts", post.id), {
        comments: arrayUnion(comment)
      });
      
      setSelectedPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
      setNewComment('');
      messageApi.success('Comment added');
    } catch (error) {
      console.log('Error commenting on news:', error);
      messageApi.error('Failed to add comment');
    }
  };
  
  const fetchPostDetails = async (post, isNews) => {
    console.log(post)
   setuserid(post.id);
    try {
      if (isNews) {
        const globalPostRef = doc(db, "globalPosts", post.id);
        const postSnap = await getDoc(globalPostRef);
         console.log("postsnap",postSnap.data())
        if (postSnap.exists()) {
          console.log(postSnap.data())
          setSelectedPost({ ...postSnap.data(), isNews: true });
        }
      } else {
        const postRef = doc(db, "users", post.uid, "posts", post.id);
        const postSnap = await getDoc(postRef);
        console.log("users ",postSnap.data());
        if (postSnap.exists()) {
          setSelectedPost({ ...postSnap.data(), isNews: false });
        }
      }
      setmodelopen(true);
    } catch (error) {
      console.log('Error fetching post details:', error);
      messageApi.error('Failed to load post details');
    }
  };
  //console.log(msg);
  
  return (
    <>
    <Modal 
        open={Sharemodel}
        onCancel={() => setSharemodel(false)}
        width={500}
        centered
        footer={null}
        className="rounded-lg overflow-hidden"
        classNames={{
          content: 'p-0',
          header: 'hidden'
        }}
      >
        <Share SharePost={SharePost} Sharemodel={setSharemodel} curuser={user.uid} source={bol}/>
      </Modal>
    <Modal
    open={modelopen}
    onCancel={() => setmodelopen(false)}
    centered
    footer={null}
    width={600}
  >
    <div className="p-4">
      <img 
        src={selectedPost?.mediaUrl} 
        alt={selectedPost?.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h2 className="text-xl font-semibold mt-4">{selectedPost?.title}</h2>
      <p className="text-gray-600 mt-2">{selectedPost?.caption}</p>
      {!selectedPost?.isNews &&
       <p className="text-gray-600 mt-2"> likes {selectedPost?.likes}</p>
       }
      
      

      <div className="mt-4">
        <h3 className="font-medium mb-2">Comments</h3>
        <div className="max-h-40 overflow-y-auto">
          {selectedPost?.comments?.map((comment, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <img 
                src={comment.userPhoto} 
                alt={comment.userName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{comment.userName}</p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            onClick={() => selectedPost?.isNews ? 
              handleNewsComment(selectedPost) : 
              handleComment(selectedPost)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </Modal>
  {msglen === 0 ? (
    
  <div className="flex flex-col items-center justify-center h-full">
    <div className="animate-bounce mb-4">
      <svg 
        className="w-16 h-16 text-blue-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h3>
    <p className="text-gray-500 text-center max-w-sm">
      Send your first message to begin chatting with your friends
    </p>
    <div className="mt-4">
      <span className="inline-block animate-pulse">
        <span className="inline-block animate-bounce mx-1">👋</span>
      </span>
    </div>
  </div>
) :(
  <>
<div className='text-[#8A8A8A] text-center text-sm py-2'>{msg.day}</div>
      <div className={`flex ${msg.email === user.email ? 'justify-end' : 'justify-start'}`}>
        <Popover placement={msg.email === user.email ? "left" : "right"} title='Options' content={content}>
        <div
  style={{ 
    backgroundColor: msg.email === user.email ? messageTheme.msgRight : messageTheme.msgLeft 
  }}
  className={`max-w-[50%] rounded-[22px] m-4 ${
    msg.email === user.email 
      ? 'ml-auto px-[5px] py-[2px] pb-[3px]' 
      : 'mr-auto px-4 py-2'
  }`}
>
            {contextHolder}
            <div className="flex flex-col gap-2">
              {msg.post ? ( 
                // Post Layout
                <div className="rounded-lg border border-gray-200 overflow-hidden"  onClick={() => fetchPostDetails(msg, msg.isNews)}>
                   {msg.forward && (
      <div className="text-xs text-gray-500 flex items-center mb-1">
        <span>↩️ Forwarded</span>
      </div>
    )}
                  <img 
                    src={msg.mediaUrl} 
                    alt={msg.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{msg.title}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2 mt-1">{msg.caption}</p>
                    <button 
                    
                      className="text-blue-500 text-xs mt-2"
                    >
                      Read more
                    </button>
               
                  </div>
                </div>
              ) : (
                // Regular Message Layout
                <div className="flex items-start gap-2">
                  <img 
                    src={msg.email === user.email ? msg.call?msg.logo:user.photoURL : msg.logo} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                  {msg.forward && (
      <div className="text-xs text-gray-500 flex items-center mb-1">
        <span>↩️ Forwarded</span>
      </div>
    )}
                  {msg.text.startsWith("https://firebasestorage.googleapis.com") ? (
                    <Image 
                      src={msg.text} 
                      alt="uploaded" 
                      className="max-w-[300px] rounded-lg"
                    />
                  ) : (
                    <span className="message-text break-words">{msg.text}</span>
                  )}
                </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-1">
                <span 
                  className="demoji cursor-pointer" 
                  id={`msgr-${id1}`} 
                  onClick={() => handleDemojiClick(id1)}
                />
                <span className="text-xs text-gray-500">{formatTime(msg.time)}</span>
              </div>
            </div>
          </div>
        </Popover>
      </div>
      </>
    )}
    </>
  );
}  