
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
import {WandSparkles,ChevronDown} from "lucide-react";
const { Header, Content, Sider } = Layout;

import UserContext from './context/context';
import ChatContext from './context/ChatContext';
import { Follow } from './Follow';
import GroupContext from './context/GroupContext';
import { onMessage } from 'firebase/messaging';


import { registerForPushNotifications } from '../utils/fcmUtils';
import { sendNotification } from '../utils/notificationUtils';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';
import { UserIcon } from 'lucide-react';
import { Share } from './Share';
import { PostModal } from './PostModal';
import { Story } from './Story';
import { StoryView } from './StoryView';
import { StoryUpload } from './StoryUpload';
import { AllStories } from './AllStories';
import PersonalizedFeed from './PersonalFeed';

import ai from '@/hooks/ai';
import internal from 'stream';
import SparklesText from './ui/sparkles-text';
const HomeIntro = () => {
  const [postData,setpostData]=useState([]);
  const [openSummaries, setOpenSummaries] = useState([]);

  const[loading1,setLoading]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [storyUploadModal,setStoryUploadModal]=useState(false);
  const [storyViewModal,setStoryViewModal]=useState(false);
  const [ selectedStory,setSelectedStory] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const { suggestions,setSuggestions, loading, error, fetchSuggestions } = ai();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(UserContext);
  const [SharePost,setSharePost]=useState(null);
  const{users,selectedPost, setSelectedPost,suggestedUsers,setsuggestedUsers}=useContext(GroupContext);
  const {homereload}=useContext(ChatContext);
  const [newsLikes, setNewsLikes] = useState({});
  const [newsComments, setNewsComments] = useState({});
  const [Sharemodel,setSharemodel]=useState(false);
  const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

  const[personal,setpersonal]=useState(false);
  const [owner,setowner]=useState(false);

useEffect(() => {

  const handleForegroundNotifications = async () => {
    const token = await registerForPushNotifications(user.uid);
    console.log('FCM Token registered:', token);

    const unsubscribe = onMessage(messaging, (payload) => {
      // Play notification sound
      const notificationSound = new Audio('/tap.mp3');
      notificationSound.play();

      // Show Ant Design notification
      message.info({
        content: `${payload.notification.body} `,
        duration: 10,
       
      });

    return () => unsubscribe();
  });
}

  handleForegroundNotifications();
  
}, [user.uid]);

 
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
const interest = () => {
  const d = localStorage.getItem('userInterests');
  return d ? d.split(' ').join(',') : "technology";
};


//console.log("interseti",interest())
useEffect(() => {
 
 

  const fetchData = async () => {
    setLoading(true);
    const storedPosts = localStorage.getItem('cachedPosts');
    const notInterestedPosts = JSON.parse(localStorage.getItem('notInterestedPosts') || '[]');
    
    if (storedPosts && homereload === 0) {
     
      const filteredPosts = JSON.parse(storedPosts).filter(
        post => !notInterestedPosts.includes(post.id)
      );

      setpostData(filteredPosts);
      setLoading(false);
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
    setLoading(false);
    // Fetch news in parallel
    const inter=interest();
    fetch(`https://api.mediastack.com/v1/news?access_key=4af5790a65dc4f27e4d63fcc99e335c3&countries=us,in&categories=${interest()}&languages=en&limit=95&date=${getLastThreeDays()}&sort=published_desc`)

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
    //   'q='+ interest() +
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
    
// Add this helper function
const isValidImageUrl = (url) => {
  if (!url) return false;

  // Check for direct image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)$/i;
  
  // Check for common image hosting patterns
  const imageHostingPatterns = [
    /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)/i,  // Matches image extensions anywhere in URL
    /\/image\//i,
    /\/images\//i,
    /\/media\//i,
    /\/photos?\//i,
    /\/full\//i,
    /\/upload/i,
    /cloudinary/i,
    /imgix/i,
    /\.cdn\./i
  ];

  // Test for direct extension match
  if (imageExtensions.test(url)) return true;

  // Test for any image hosting pattern
  return imageHostingPatterns.some(pattern => pattern.test(url));
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
    
    const scrollVariants = {
      hidden: {
        opacity: 0,
        y: 20, // Reduced distance
        scale: 0.98 // Subtler scale
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3, // Faster duration
          ease: "easeOut"
        }
      }
    };
    const PostSkeleton = () => (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton.Avatar active size={32} />
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        </div>
        <Skeleton.Image active className="w-full aspect-square" />
        <div className="mt-4">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </div>
    );  
    const [stories,setStories]=useState([])

    const {storytrigger,setstorytrigger}=useContext(ChatContext)
    useEffect(() => {
        const fetchstories = async () => {
          const storyref = collection(db, 'stories');
          const storydata = await getDocs(storyref);
          
          const currentTime = Timestamp.now();
          
          const stories = storydata.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(story => {
              if (story.expiryTime.toDate() > currentTime.toDate()) {
                return true;
              } else {
                // Update the story document to mark it as expired
                updateDoc(doc(db, 'stories', story.id), {
                  expired: true
                });
                return false;
              }
            });
      
          setStories(stories);
          console.log(stories);
        }
      
        fetchstories();
      }, [user])
      
  
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-center">
          <SideBar />
   
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
        open={personal}
        onCancel={() => setpersonal(false)}
        width={1000}
        footer={null}
        className=""
        style={{ top: 20 }}
      >
        <PersonalizedFeed  setpersonal={setpersonal} />
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
        <Share SharePost={SharePost} Sharemodel={setSharemodel} curuser={user.uid} source="home"/>
      </Modal>
          
          {/* Main Content Area */}
          <main className="flex-1 md:ml-[220px] mb-16 md:mb-0 relative max-w-[935px]">
          <div className="mx-auto px-2 md:px-4">
              <div className="flex flex-col md:flex-row md:gap-8">
                {/* Stories and Posts Column */}
                <div className="w-full md:w-[calc(100%-320px)]">
                  {/* Stories Section */}
                  <div className="bg-white rounded-lg mb-4 overflow-hidden relative">
                  {isHeartAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <HeartFilled className="text-4xl md:text-6xl text-violet-500 animate-like-heart" />
                </div>
            )}
<Modal
  open={storyViewModal}
  onCancel={() => setStoryViewModal(false)}
  footer={null}
  width={600}
  centered
  className="story-view-modal"
>
    
  <StoryView selectedStory={selectedStory}  onclose={setStoryViewModal}  owner={owner?"firechat":"none"}/>
</Modal>
  <div className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-4">
    <Carousel
      arrows={true}
      dots={false}
      slidesToShow={3}
      slidesToScroll={1}
      infinite={false}
      responsive={[
        {
          breakpoint: 640,
          settings: {
            slidesToShow:3,
            slidesToScroll: 1,
            arrows: false,
           
           
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1536,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]}
      className="stories-carousel"
    >
     <StoryUpload/>

  {/* FireChat Logo Card */}
  <div className="px-2">
    <div className="flex flex-col items-center justify-center">
      <div className="block cursor-pointer"  onClick={() => {
           setowner(true);
            setStoryViewModal(true);
          }}
        >
        <div className="story-ring p-[2px] rounded-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-spin-slow"></div>
          <div className="bg-white p-[2px] rounded-full flex items-center justify-center relative z-10">
            <Avatar
              size={48}
              src="/logo2.png"
              alt="FireChat"
              className="story-avatar"
            />
          </div>
        </div>
        <p className="text-white text-xs mt-2 truncate w-14 text-center">
          FireChat
        </p>
      </div>
    </div>
  </div>
  {stories?.map((story,index) => (
        <div key={story.id} className="px-2 inline-block">
          <div className="flex flex-col items-center justify-center">
           
            <button 
             onClick={() => {
                setSelectedStory(story);
                setStoryViewModal(true);
              }}
            className="block focus:outline-none">
              <div className="story-ring p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                <div className="bg-white p-[2px] rounded-full flex items-center justify-center">
                  <Avatar
                    size={48}
                    src={story.mediaUrl || '/default-avatar.png'}
                    alt={story.displayName}
                    className="story-avatar"
                  />
                </div>
              </div>
              <p className="text-white text-xs mt-2 truncate w-14 text-center">
                {story.displayName}
              </p>
            </button>

          </div>
        </div>
      ))}
    </Carousel>
  </div>
</div>



                  {/* Posts Section */}
                  <div className="w-full">
                    <InfiniteScroll
                      dataLength={postData.length}
                      // next={fetchMorePosts}
                      // hasMore={hasMore}
                      loader={<Spin />}
                      endMessage={
                        <motion.div
                          animate={{ 
                            opacity: [0.4, 1, 0.4],
                            scale: [0.98, 1, 0.98]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-center p-6"
                        >
                          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                           Analyzing ✨
                          </span>
                        </motion.div>
                      }
                    >
                      <List
                        itemLayout="vertical"
                        dataSource={postData.filter((item,index) => {
                          
                          if (!item.mediaUrl || !item.author) return false;
                          return isValidImageUrl(item.mediaUrl);
                        })}
                        loading={loading1}
                        className="space-y-2"
                        renderItem={(item,index) => (
                          <motion.div
                          className="bg-white rounded-lg shadow-sm overflow-hidden relative"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ 
                            margin: "100px", 
                            once: true // Ensures animation plays only once
                          }}
                          variants={scrollVariants}
                          custom={index} // Use index for staggered animations
                          transition={{
                            delay: index * 0.1 // Stagger the animations
                          }}
                        >
                               {isHeartAnimating && (
<div className="absolute inset-0 flex items-center justify-center z-50">
<HeartFilled
className="text-6xl text-red-500 animate-like-heart"
 style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
/>
</div>
 )}
                            {/* Post Header */}
                            <div className="flex items-center justify-between p-3 border-b">
                              <div className="flex items-center justify-between space-x-3">
                                <Avatar 
                                  src={item.isNews ? '/logo3.png' : item.profile} 
                                  size={32}
                                  className="cursor-pointer"
                                  onClick={() => handlenavigate(item.uid, item.isNews)}
                                />
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                  <span className="font-semibold text-sm">
                                    {item.isNews ? item.author : item.username}
                                  </span>
                                  <span className="text-gray-500 text-xs ">
                                    {item.isNews 
                                      ? new Date(item.publishedAt).toLocaleDateString()
                                      : formatRelativeDate(item.timestamp)
                                    }
                                  </span>
                                  {index === 0 && (
               <button
               className='md:hidden ml-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border-violet-500/20 rounded-full px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-90'
               onClick={() => setpersonal(true)}
           >
               <WandSparkles className="text-violet-500 animate-pulse" size={16} />
               <span className="font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text text-center">
                   Feed
               </span>
           </button>
            )}
                                </div>
                              </div>
                              <Popover
                                content={
                                  <div className="flex flex-col space-y-2">
                                    <Button type="text" block
                                    onClick={()=>{
                                        const notInterestedPosts = JSON.parse(localStorage.getItem('notInterestedPosts') || '[]');
                                        localStorage.setItem('notInterestedPosts',
                                        JSON.stringify([...notInterestedPosts, item.id])
                                     );
                                        setpostData(prevPosts => prevPosts.filter(post => post.id !== item.id));
                                         message.success('Post removed from your feed');
                                        }}
                                    >Not Interested</Button>
                                    <Report />
                                    {item.mediaUrl && (
                                      <Button type="text" block
                                    onClick={() => {
                                         window.open(item.mediaUrl, '_blank');
                                         message.success('Download started');
                                         }}
                                      >Download</Button>
                                    )}
                                  </div>
                                }
                              >
                                <Button type="text" icon={<EllipsisOutlined />} />
                              </Popover>
                            </div>
                            

                            {/* Post Image */}
                            <div className="relative aspect-square w-full">
                              <img 
                                src={item.mediaUrl} 
                                alt={item.title || item.caption} 
                                className="w-full h-full object-cover"
                                onClick={() => {
                                  setSelectedPost(item);
                                  dataadd(item);
                                  setModalVisible(true);
                                }}
                              />
                            </div>

                            {/* Post Actions */}
                            <div className="p-3">
                              <div class="flex items-center justify-between w-full">
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
                                <Button 
                                  type="text" 
                                  icon={<ShareAltOutlined />}
                                  onClick={() => {
                                    setSharePost(item);
                                    setSharemodel(true);
                                    dataadd(item);
                                  }}
                                />
                                </div>
                                <Button
    type="text"
    className="flex items-center gap-2 px-3 py-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors duration-200 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
    icon={<WandSparkles className='text-violet-500 animate-pulse' size={14} />}
    onClick={() => {
      fetchSuggestions(
          `Explain the meaning of the following post briefly and clearly:\n\n${item.caption}`,
          0.6,
          6000,
          "mixtral-8x22b-instruct",
          "chat"
      )
      
      setIsOpen(true);

      setOpenSummaries(prev => [...prev, item.id]);
  }}
>
   
        <SparklesText  sparklesCount={1} className="text-xs" text={"Summarize"}/>
 
</Button>




                              </div>

                              <div className="mt-2">
                                <span className="font-semibold">
                                  {item.isNews ? newsLikes[item.id] || 0 : item.likes} likes
                                </span>
                              </div>

                              {/* Caption */}
                              <div className="mt-2">
                                <span className="font-semibold mr-2">{item.username}</span>
                                <span className="text-sm">{item.caption}</span>
                              </div>


                              {(suggestions || loading) && openSummaries.includes(item.id) && (
    <div className="mt-2 bg-violet-50 rounded-lg p-3">
        <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-2">
                <WandSparkles className="text-violet-500" size={14} />
                <span className="text-sm font-medium text-violet-700">AI Summary</span>
            </div>
            <ChevronDown 
                className={`text-violet-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                size={16} 
            />
        </div>

        {loading && (
            <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )}

        { openSummaries.includes(item.id) && isOpen && suggestions && (
            <div className="mt-2 text-sm text-gray-700 border-t border-violet-100 pt-2" id="ai"
           
            >
                {suggestions}
            </div>
          
        )}
        
    </div>
)}

                              {/* Comments */}
                              {!item.isNews && item.comments?.length > 0 && (
                                <Button
                                  type="text"
                                  block
                                  className="text-gray-500 text-sm mt-2"
                                  onClick={() => {
                                    setSelectedPost(item);
                                    setModalVisible(true);
                                  }}
                                >
                                  View all {item.comments.length} comments
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      />
                    </InfiniteScroll>
                  </div>
                </div>

                {/* Suggestions Sidebar */}
                <div className="hidden md:block w-[320px] flex-shrink-0">
                  <div className="sticky top-4">
                  <Card 
    title={
        <div className="flex flex-col gap-3">
            <span>{`Suggestions for you ${user.displayName}`}</span>
            <button
    className='flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border-violet-500/20 rounded-full px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-90'
    onClick={() => setpersonal(true)}
>
    <WandSparkles className="text-violet-500 animate-pulse" size={16} />
    <span className="font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text text-center">
        Feed
    </span>
</button>

          
        </div>
    }
>
                      {suggestedUsers.length === 0 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={[1, 2, 3]}
                          renderItem={() => (
                            <List.Item>
                              <Skeleton
                                loading={true}
                                active
                                avatar
                                paragraph={false}
                                title={{ width: '60%' }}
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <List
                          itemLayout="horizontal"
                          dataSource={suggestedUsers}
                          renderItem={user => (
                            <List.Item  >
                              <List.Item.Meta className='cursor-pointer'  onClick={() => handlenavigate(user.uid, false)}
                                avatar={<Avatar src={user.photoURL} />}
                                title={user.displayName}
                              />
                              <Follow 
                                uid1={user.uid} 
                                username1={user.displayName} 
                                userurl1={user.photoURL}
                              />
                            </List.Item>
                          )}
                        />
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      </div>
  );
};

export default HomeIntro;

    
   
  