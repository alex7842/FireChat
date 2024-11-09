
import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, Avatar, List, Spin,Row, Col, Card, Carousel, Divider, Typography,Flex, Popover} from 'antd';
import { HeartFilled, HeartOutlined, ShareAltOutlined, CommentOutlined, DeleteOutlined,PlusOutlined,EllipsisOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, Button, Input, message, Popconfirm ,notification} from 'antd';
import { SideBar } from './SideBar';
import { collection,getDocs,query,doc,getDoc,setDoc,deleteDoc,Timestamp,updateDoc,increment,arrayUnion,addDoc,serverTimestamp} from 'firebase/firestore';
import { db,messaging } from '../config/firebase';
import { Report } from './Report';
import { ShowPost } from './ShowPost';

const { Header, Content, Sider } = Layout;
import UserContext from './context/context';
import ChatContext from './context/ChatContext';
import { Follow } from './Follow';
import GroupContext from './context/GroupContext';
import { onMessage } from 'firebase/messaging';


import { registerForPushNotifications } from '../utils/fcmUtils';
import { sendNotification } from '../utils/notificationUtils';
import { Share } from './Share';
import { PostModal } from './PostModal';
const HomeIntro = () => {
  const [postData,setpostData]=useState([]);
 
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestedUsers,setsuggestedUsers]=useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(UserContext);
  const [SharePost,setSharePost]=useState(null);
  const{users,selectedPost, setSelectedPost}=useContext(GroupContext);
  const {homereload}=useContext(ChatContext);
  const [newsLikes, setNewsLikes] = useState({});
  const [newsComments, setNewsComments] = useState({});
  const [Sharemodel,setSharemodel]=useState(false);
//console.log("users",users);
const notificationSound = new Audio('/tap.mp3'); // Add an MP3 file to your public folder

// useEffect(() => {
//   const handleNewMessage = async (payload) => {
//     console.log('New message received:', payload);
    
//     // Play notification sound
//     notificationSound.play();

//     // Show Ant Design notification
//     notification.open({
//       message: payload.notification.title,
//       description: payload.notification.body,
//       icon: <Avatar src={payload.data?.senderPhoto} />,
//       placement: 'topRight',
//       duration: 4,
//       style: {
//         borderRadius: '8px',
//         backgroundColor: '#f0f2f5'
//       }
//     });
//   };

//   const unsubscribe = onMessage(messaging, handleNewMessage);
//   return () => unsubscribe();
// }, []);

// Second useEffect for FCM token registration
// useEffect(() => {
//   const registerToken = async () => {
//     const token = await registerForPushNotifications(user.uid);
//     console.log('FCM Token registered:', token);
//   };

//   registerToken();
// }, [user.uid]);

// useEffect(() => {
//   const handleForegroundNotifications = async () => {
//     const token = await registerForPushNotifications(user.uid);
//     console.log('FCM Token registered:', token);

//     const unsubscribe = onMessage(messaging, (payload) => {
//       // Play notification sound
//       const notificationSound = new Audio('/tap.mp3');
//       notificationSound.play();

//       // Show Ant Design notification
//       message.info({
//         content: (
//           <div className="notification-content">
//             <div className="notification-header">
//               <h4 className="notification-title">{payload.notification.title}</h4>
//             </div>
//             <div className="notification-message">
//               <p className="notification-body">{payload.notification.body}</p>
//             </div>
//           </div>
//         ),
//         duration: 7,
//         className: 'custom-toast',
//         style: {
//           marginTop: '24px',
//           borderRadius: '12px',
//           boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
//           border: '1px solid #e8eaed'
//         }
//       });
      
      
//     });

//     return () => unsubscribe();
//   };

//   handleForegroundNotifications();
// }, [user.uid]);


// Third useEffect for storing notifications in Firestore
// useEffect(() => {
//   const storeNotification = async (payload) => {
//     const notificationsRef = collection(db, 'users',payload.data?.senderId, 'notifications');
    
//     await addDoc(notificationsRef, {
//       title: payload.notification.title,
//       body: payload.notification.body,
//       timestamp: serverTimestamp(),
//       read: false,
//       type: payload.data?.type || 'message',
//       senderId: payload.data?.senderId,
//       senderName: payload.data?.senderName,
//       senderPhoto: payload.data?.senderPhoto
//     });
//   };

//   const unsubscribe = onMessage(messaging, storeNotification);
//   return () => unsubscribe();
// }, [user.uid]);




// Add this near your other useEffect hooks
// useEffect(() => {
  
// }, []);

 
useEffect(() => {
  const fetchNewsLikes = async (postId) => {
    const globalPostRef = doc(db, "globalPosts", postId);
    const docSnap = await getDoc(globalPostRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      setNewsLikes(prev => ({
        ...prev,
        [postId]: data.likedBy?.length || 0
      }));
      setNewsComments(prev => ({
        ...prev,
        [postId]: data.comments || []
      }));
    }
  };

  // Fetch likes for news posts
  postData.forEach(item => {
    if (item.isNews) {
      fetchNewsLikes(item.id);
    }
  });
}, [postData]);
const getLastThreeDays = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 3);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  return `${formatDate(start)},${formatDate(end)}`;
};

useEffect(() => {
  const fetchData = async () => {
    
    const storedPosts = localStorage.getItem('cachedPosts');
    const notInterestedPosts = JSON.parse(localStorage.getItem('notInterestedPosts') || '[]');
    
    if (storedPosts && homereload === 0) {
      const filteredPosts = JSON.parse(storedPosts).filter(
        post => !notInterestedPosts.includes(post.id)
      );

      setpostData(filteredPosts);
     
      return;
    }

    // Fetch database posts
    const postref = collection(db, "users");
    const usersSnapshot = await getDocs(postref);
    let allPosts = [];

    for (const userDoc of usersSnapshot.docs) {
      const postsRef = collection(db, "users", userDoc.id, "posts");
      const postsSnapshot = await getDocs(postsRef);
      
      const userPosts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        author: userDoc.id,
        ...doc.data()
      }));
      
      allPosts = [...allPosts, ...userPosts];
    }

    allPosts.sort((a, b) => {
      const timestampA = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const timestampB = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return timestampB - timestampA;
    });
  console.log("db post",allPosts)
    // Set database posts immediately
    setpostData(allPosts);
   
    // Fetch news in parallel
   
    fetch('https://api.mediastack.com/v1/news?access_key=83f26e0b599a2f52b3c245fa871da266&countries=us,in&categories=technology&languages=en&limit=95&date=' + getLastThreeDays() + '&sort=published_desc')

      .then(response => response.json())
      .then(newsData => {
        console.log(newsData,"news data");  
        const newsAsPosts = newsData.data.map((article) => ({
          id: `news-${encodeURIComponent(article.published_at)}-${encodeURIComponent(article.title)}`,
          author: article.author || article.source,
          caption: article.description,
          mediaUrl: article.image || `https://source.unsplash.com/800x400/?${encodeURIComponent(article.title)}`,
          sourceName: article.source,
          title: article.title,
          publishedAt: article.published_at,
          timestamp: new Date(article.published_at),
          isNews: true
        }));
    // fetch('https://newsapi.org/v2/everything?' +
    //   'q=technology OR artificial intelligence OR science' +
    //   '&language=en' +
    //   '&pageSize=60' +
    //   '&sortBy=publishedAt' +
    //   '&apiKey=4b088fd990774c72a1ffbf23ca491daf')
    //   .then(response => response.json())
    //   .then(newsData => {
    //     const newsAsPosts = newsData.articles.map((article) => ({
    //       id: `news-${encodeURIComponent(article.publishedAt)}-${encodeURIComponent(article.title)}`,
    //       author: article.source.name,
    //       caption: article.content,
    //       mediaUrl: article.urlToImage,
    //       sourceName: article.source.name,
    //       title: article.title,
    //       publishedAt: article.publishedAt,
    //       timestamp: new Date(article.publishedAt),
    //       isNews: true
    //     }));
    
        
  console.log(newsAsPosts,"news posts");
        const combinedPosts = [...allPosts, ...newsAsPosts].filter(
          post => !notInterestedPosts.includes(post.id)
        );

        localStorage.setItem('cachedPosts', JSON.stringify(combinedPosts));
        setpostData(combinedPosts);
      });
  };

  fetchData();
  

  
}, [homereload]);

  
//console.log("suggestedUsers",suggestedUsers);
      
      
      const storiesData = [
        { id: 1, user: 'user1', avatar: 'https://via.placeholder.com/150' },
        { id: 2, user: 'user2', avatar: 'https://via.placeholder.com/150' },
        { id: 1, user: 'user1', avatar: 'https://via.placeholder.com/150' },
        { id: 2, user: 'user2', avatar: 'https://via.placeholder.com/150' },
        { id: 1, user: 'user1', avatar: 'https://via.placeholder.com/150' },
        { id: 2, user: 'user2', avatar: 'https://via.placeholder.com/150' },
        { id: 1, user: 'user1', avatar: 'https://via.placeholder.com/150' },
        { id: 2, user: 'user2', avatar: 'https://via.placeholder.com/150' },
        // Add more stories as needed
      ];
      // const sendnotify= async(targetid)=>{
      //   console.log("called");
      //   const recipientDoc = await getDoc(doc(db, "users", targetid));
      //   const recipientFcmToken = recipientDoc.data().fcmToken;
      //   console.log("recipientFcmToken",recipientFcmToken);
      //   // Send notification
      //   if (recipientFcmToken) {
      //     await sendNotification(recipientFcmToken, `New message from ${user.displayName}: ${"hello plaese notify"}`,user.displayName,user.displayName,user.photoURL);
      //   }
      // }

    const navigate=useNavigate()

   
    const handleLike = async (post) => {
      // Create a likes subcollection for each post to track user likes
      const postLikesRef = collection(db, "users", post.uid, "posts", post.id, "likes");
      const userLikeRef = doc(postLikesRef, post.uid);
      
      try {
        const userLikeDoc = await getDoc(userLikeRef);
        const isCurrentlyLiked = userLikeDoc.exists();
        const newLikeCount = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;
    
        // Update UI immediately
        setLikedPosts(prev => ({
          ...prev,
          [post.id]: !isCurrentlyLiked
        }));
    
        // Update posts state
        const updatedPosts = postData.map(p =>
          p.id === post.id ? {...p, likes: newLikeCount} : p
        );
        setpostData(updatedPosts);
    
        if (selectedPost?.id === post.id) {
          setSelectedPost(prev => ({...prev, likes: newLikeCount}));
        }
    
        // Trigger animation
        setIsHeartAnimating(true);
        setTimeout(() => setIsHeartAnimating(false), 1500);
    
        // Update database
        const postRef = doc(db, "users", post.uid, "posts", post.id);
        
        if (isCurrentlyLiked) {
          await deleteDoc(userLikeRef);
        } else {
          await setDoc(userLikeRef, {
            timestamp: Timestamp.now()
          });
        }
        
        await updateDoc(postRef, { likes: newLikeCount });
    
      } catch (error) {
        console.log('Error updating like:', error);
        message.error('Failed to update like');
        // Revert UI changes
        setLikedPosts(prev => ({...prev, [post.id]: !prev[post.id]}));
        setpostData(postData);
        setSelectedPost(selectedPost);
      }
    };
    
    const handleNewsLike = async (item) => {
      const isCurrentlyLiked = likedPosts[item.id];
      
      // Update UI immediately
      setLikedPosts(prev => ({
        ...prev,
        [item.id]: !isCurrentlyLiked
      }));
    
      // Update news likes count immediately
      setNewsLikes(prev => ({
        ...prev,
        [item.id]: Math.max(0, (prev[item.id] || 0) + (isCurrentlyLiked ? -1 : 1))
      }));
    
      // Trigger heart animation
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 1500);
    
      const globalPostRef = doc(db, "globalPosts", item.id);
    
      try {
        const postDoc = await getDoc(globalPostRef);
        
        if (!postDoc.exists()) {
          await setDoc(globalPostRef, {
            id: item.id,
            title: item.title,
            caption: item.caption,
            mediaUrl: item.mediaUrl,
            sourceName: item.sourceName,
            publishedAt: item.publishedAt,
            likes: isCurrentlyLiked ? 0 : 1,
            likedBy: isCurrentlyLiked ? [] : [{
              userId: user.uid,
              username: user.displayName,
              timestamp: new Date()
            }],
            comments: [],
            lastUpdated: new Date()
          });
        } else {
          const currentData = postDoc.data();
          if (isCurrentlyLiked) {
            // Remove like
            await updateDoc(globalPostRef, {
              likes: increment(-1),
              likedBy: currentData.likedBy.filter(like => like.userId !== user.uid),
              lastUpdated: new Date()
            });
          } else {
            // Add like
            await updateDoc(globalPostRef, {
              likes: increment(1),
              likedBy: arrayUnion({
                userId: user.uid,
                username: user.displayName,
                timestamp: new Date()
              }),
              lastUpdated: new Date()
            });
          }
        }
      } catch (error) {
        // Revert all local changes
        console.log(error,"news like");
        setLikedPosts(prev => ({
          ...prev,
          [item.id]: isCurrentlyLiked
        }));
        setNewsLikes(prev => ({
          ...prev,
          [item.id]: Math.max(0, (prev[item.id] || 0) + (isCurrentlyLiked ? 1 : -1))
        }));
        message.error('Unable to update like');
      }
    };
  

const dataadd= async (item)=>{
  const globalPostRef = doc(db, "globalPosts", item.id);
  try {
    if(item.isNews){
    const postDoc = await getDoc(globalPostRef);
    if (!postDoc.exists()) {
      await setDoc(globalPostRef, {
        id: item.id,
        title: item.title,
        caption: item.caption,
        mediaUrl: item.mediaUrl,
        sourceName: item.sourceName,
        publishedAt: item.publishedAt,
        uid:item.isNews?item.id:item.uid,
        likes: 0 ,
        likedBy: [{
          
        }],
        comments: [],
        lastUpdated: new Date()
      });
    } 
  }
}
  catch(err){
    console.log(err);
  }
}
    
    
    const handleNewsComment = async (postId) => {
      if (!newComment.trim()) return;
    
      const globalPostRef = doc(db, "globalPosts", postId);
      const comment = {
        text: newComment,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        timestamp: Timestamp.now()
      };
    
      try {
        await updateDoc(globalPostRef, {
          comments: arrayUnion(comment)
        });
    
        setSelectedPost({
          ...selectedPost,
          comments: [...(selectedPost.comments || []), comment]
        });
    
        setpostData(postData.map(post =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        ));
    
        setNewComment('');
        message.success('Comment added successfully');
      } catch (error) {
        console.log('Error adding comment:', error);
        message.error('Failed to add comment');
      }
    };
    
    
    const handleComment = async (postId) => {
      if (!newComment.trim()) return;
  
      const postRef = doc(db, "users", selectedPost.uid, "posts", postId);
      const comment = {
        text: newComment,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        timestamp: Timestamp.now()
      };
  
      try {
        await updateDoc(postRef, {
          comments: [...(selectedPost.comments || []), comment]
        });
  
        setSelectedPost({
          ...selectedPost,
          comments: [...(selectedPost.comments || []), comment]
        });
  
        setpostData(postData.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        ));
  
        setNewComment('');
        message.success('Comment added successfully');
      } catch (error) {
        console.log('Error adding comment:', error);  
        message.error('Failed to add comment');
      }
    };
    

// Add this helper function
const isValidImageUrl = (url) => {
  if (!url) return false;
  // Check if it's an unsplash fallback URL
  if (url.includes('source.unsplash.com')) return false;
  // Check for common image extensions and valid URL patterns
  return (
    url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
    url.includes('images') ||
    url.includes('media') ||
    url.includes('photos')
  );
};

    const formatRelativeDate = (timestamp) => {
      let date;
      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      // Reset time to start of day for accurate day comparison
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const diffTime = startOfToday - startOfDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return `Yesterday (${formattedDate})`;
      } else if (diffDays < 7) {
        return `${diffDays} days ago (${formattedDate})`;
      } else {
        return formattedDate;
      }
    };
    const handlenavigate=(uid,isnews)=>{
      if(!isnews){
        navigate(`/Profilepage/${uid}`);
      }
    }
    
  
    return (
      <Layout>
         <Modal
  open={modalVisible}
  onCancel={() => setModalVisible(false)}
  width={1000}
  footer={null}
  className="post-modal"
  style={{ top: 20 }}
>
  <PostModal postData={postData} setpostData={setpostData} />
  
</Modal>
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
    <Share SharePost={SharePost} Sharemodel={setSharemodel}/>
</Modal>

    
     
        <SideBar/>
       
          <Layout style={{ padding: '0 24px 24px 70px' }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Row gutter={[60,40]}>
                <Col span={15}>
                  <Carousel arrows dots={false} slidesToShow={4} infinite={false} >
                    {storiesData.map(story => (
                      <Card key={story.id} style={{ textAlign: 'center' }}>
                        <Avatar size={64} src={story.avatar} />
                        <p>{story.user}</p>
                      </Card>
                    ))}
                  </Carousel>
                  <InfiniteScroll
                    dataLength={postData.length}
                 
              
                    loader={<Spin />}
                   // endMessage={<p style={{ textAlign: 'center' }}></p>}
                  >
                 <List
      itemLayout="horizontal"
      dataSource={postData}
      renderItem={item => {
        if (item.isNews && (!isValidImageUrl(item.mediaUrl) || !item.author)) return null;


        return (
          <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-4 p-4 bg-white relative">
            {isHeartAnimating && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <HeartFilled
                  className="text-6xl text-red-500 animate-like-heart"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
                />
              </div>
            )}

            <div className="flex flex-col rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center space-x-5">
                  
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={()=>handlenavigate(item.uid,item.isNews)}>
                    <Avatar 
                      src={item.isNews ? '/newslogo.png' : item.profile} 
                      size={32} 
                    />
                    <span className="font-semibold">
                      {item.isNews ? item.author : item.username}
                    </span>
                  </div>
                  {item.isNews ? (
                    <span className="text-gray-500 text-sm">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    user.uid !== item.uid ? 
                    <>
      <Follow uid1={item.uid} username1={item.username} userurl1={item.profile}/>
      <p className="text-gray-500 text-sm">
      {formatRelativeDate(item.timestamp)}
      </p>
    </>
                      :  <>
                       <p className="text-blue-500">(You)</p>
                      <p className="text-gray-500 text-sm">
                      {formatRelativeDate(item.timestamp)}
                      </p>
                     
                    </>
                  )}
                </div>

                {/* Options Popover */}
                <Popover
                  content={
                    <div className="flex flex-col space-y-2">
                      <Button
                        type="text"
                        block
                        onClick={() => {
                          const notInterestedPosts = JSON.parse(localStorage.getItem('notInterestedPosts') || '[]');
                          localStorage.setItem('notInterestedPosts',
                            JSON.stringify([...notInterestedPosts, item.id])
                          );
                          setpostData(prevPosts => prevPosts.filter(post => post.id !== item.id));
                          message.success('Post removed from your feed');
                        }}
                      >
                        Not Interested
                      </Button>
                      <Report />
                      {item.mediaUrl && (
                        <Button
                          type="text"
                          block
                          onClick={() => {
                            window.open(item.mediaUrl, '_blank');
                            message.success('Download started');
                          }}
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  }
                >
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Popover>
              </div>

              {/* Media Content */}
              <div className="group relative aspect-square overflow-hidden cursor-pointer">
                <img 
                  src={item.mediaUrl} 
                  alt={item.title || item.caption} 
                  className="w-full h-full object-cover brightness-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white flex items-center space-x-4">
                    <span className="flex items-center">
                      <HeartOutlined className="text-2xl mr-2" /> {item.likes}
                    </span>
                    <span className="flex items-center">
                      <CommentOutlined className="text-2xl mr-2" /> {item.comments?.length || 0}
                    </span>
                  </div>
                </div>
                <div
                  className="absolute inset-0"
                  onClick={() => {
                    setSelectedPost(item);
                    dataadd(item);
                    setModalVisible(true);
                  }}
                />
              </div>

              {/* Actions and Content Section */}
              <div className="p-3">
                <div className="flex items-center space-x-4">
                  <Button 
                    type="text" 
                    icon={likedPosts[item.id] ? <HeartFilled style={{color: '#ff4d4f'}} /> : <HeartOutlined />}
                    onClick={() => item.isNews ? handleNewsLike(item) : handleLike(item)}
                  />
                  <Button 
                    type="text" 
                    icon={<CommentOutlined />}
                    onClick={() => {
                      dataadd(item);
                      setSelectedPost(item);
                      setModalVisible(true);
                    }} 
                  />
                  <Button type="text" onClick={
                    ()=>{
                      setSharePost(item);
                    setSharemodel(true);
                    dataadd(item);
                  }} icon={<ShareAltOutlined />} />
                </div>

                <div className="mt-2 font-semibold">
  {item.isNews ? newsLikes[item.id] || 0 : item.likes} likes
</div>

                {item.isNews ? (
                  <div className="mt-3">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-base mb-2">{item.caption}</p>
                    <p className="text-sm text-gray-500">
                      Source: {item.sourceName} • {new Date(item.publishedAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-1">
                    <span className="font-semibold mr-2">{item.username}</span>
                    <span>{item.caption}</span>
                  </div>
                )}

                {!item.isNews && item.comments?.length > 0 && (
                  <div className="mt-2">
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setSelectedPost(item);
                        setModalVisible(true);
                      }}
                    >
                      View all {item.comments.length} comments
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
                  </InfiniteScroll>
                </Col>
               
                <Col span={8}>
                  <Card title={`Suggested for you (${user.displayName})`}>
                    <List
                      itemLayout="horizontal"
                      dataSource={users.slice(0,3)}
                      renderItem={user => (
                        //onClick={()=>sendnotify(user.uid)}
                        <List.Item >
                          <List.Item.Meta
                            avatar={<Avatar src={user.photoURL} />}
                            title={user.displayName}
                          />
                          <div><Follow uid1={user.uid} username1={user.displayName} userurl1={user.photoURL}/></div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </Content>
          </Layout>


        </Layout>

  );
};

export default HomeIntro;

    
   
  