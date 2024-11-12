
import UserContext from './context/context';
import ChatContext from './context/ChatContext';
import { Follow } from './Follow';
import GroupContext from './context/GroupContext';

import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, Avatar, List, Spin,Row, Col, Card, Carousel, Divider, Typography,Flex, Popover} from 'antd';
import { HeartFilled, HeartOutlined, ShareAltOutlined, CommentOutlined, DeleteOutlined,PlusOutlined,EllipsisOutlined } from '@ant-design/icons';

import { Modal, Button, Input, message, Popconfirm ,notification} from 'antd';
import { SideBar } from './SideBar';
import { collection,getDocs,query,doc,getDoc,setDoc,deleteDoc,Timestamp,updateDoc,increment,arrayUnion,addDoc,serverTimestamp} from 'firebase/firestore';
import { db,messaging } from '../config/firebase';
import { Report } from './Report';
import { sendNotification } from '../utils/notificationUtils';

export const PostModal = ({setpostData,postData}) => {


    const navigate=useNavigate()
    const [likedPosts, setLikedPosts] = useState({});
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);
    const [newComment, setNewComment] = useState('');
    const {selectedPost, setSelectedPost}=useContext(GroupContext);
    const { user } = useContext(UserContext);
    const{users}=useContext(GroupContext);
  const {homereload}=useContext(ChatContext);
  const [newsLikes, setNewsLikes] = useState({});
  const [newsComments, setNewsComments] = useState({});

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
        const recipientDoc = await getDoc(doc(db, "users", selectedPost.uid));
        const recipientFcmToken = recipientDoc.data().fcmToken;
        console.log("sharing user recipientFcmToken",recipientFcmToken);
        // Send notification
        if (recipientFcmToken) {
          await sendNotification(recipientFcmToken, `${user.displayName}: has commented on your Post`,user.uid,user.displayName,user.photoURL);
        }
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
    <>
   {selectedPost && (
    <div className="flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side - Media Display */}
        <div className="w-full md:w-3/5 relative bg-black">
            <div className="flex items-center justify-center h-full">
                {selectedPost.type === 'video' ? (
                    <video
                        src={selectedPost.mediaUrl}
                        controls
                        className="max-h-[50vh] md:max-h-[90vh] w-full object-contain"
                    />
                ) : (
                    <img
                        src={selectedPost.mediaUrl}
                        alt={selectedPost.caption}
                        className="max-h-[50vh] md:max-h-[90vh] w-full object-contain"
                    />
                )}
            </div>

            {/* Like Animation Overlay */}
            {isHeartAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <HeartFilled className="text-4xl md:text-6xl text-violet-500 animate-like-heart" />
                </div>
            )}

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-3 md:space-x-4">
                        <Button
                            type="text"
                            icon={likedPosts[selectedPost.id] ? 
                                <HeartFilled style={{ color: '#8B5CF6' }} /> : 
                                <HeartOutlined />}
                            className="text-white hover:text-violet-500 transition-colors"
                            onClick={() => selectedPost.isNews ? handleNewsLike(selectedPost) : handleLike(selectedPost)}
                        >
                            <span className="ml-1">{selectedPost.isNews ? newsLikes[selectedPost.id] || 0 : selectedPost.likes}</span>
                        </Button>
                        <Button
                            type="text"
                            icon={<CommentOutlined />}
                            className="text-white hover:text-violet-500 transition-colors"
                        >
                            <span className="ml-1">
                                {selectedPost.isNews ? newsComments[selectedPost.id]?.length || 0 : selectedPost.comments?.length || 0}
                            </span>
                        </Button>
                        <Button
                            type="text"
                            icon={<ShareAltOutlined />}
                            className="text-white hover:text-violet-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side - Comments and Info */}
        <div className="w-full md:w-2/5 flex flex-col bg-white h-[40vh] md:h-[90vh]">
            {/* Post Info */}
            <div className="p-3 md:p-4 border-b">
                <div className="flex items-center space-x-3 mb-2">
                    <Avatar src={user.photoURL} size={32} className="border-2 border-violet-200" />
                    <div>
                        <span className="font-semibold block text-violet-900">{user.displayName}</span>
                        <span className="text-xs text-gray-500">
                            {selectedPost.isNews
                                ? new Date(selectedPost.publishedAt).toLocaleString()
                                : selectedPost.timestamp?.toDate?.()
                                    ? selectedPost.timestamp.toDate().toLocaleString()
                                    : new Date().toLocaleString()}
                        </span>
                    </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap text-sm">{selectedPost.caption}</p>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto">
                {/* ... Comments mapping stays the same ... */}
                {selectedPost.isNews
? newsComments[selectedPost.id]?.map((comment, index) => (
<div key={index} className="p-4 border-b">
 <div className="flex items-start space-x-3">
 <Avatar src={comment.userPhoto} />
<div className="flex-1">
<div className="bg-gray-50 rounded-lg p-3">
 <span className="font-semibold block">{comment.userName}</span>
 <p className="text-gray-800">{comment.text}</p>
</div>
<span className="text-xs text-gray-500 mt-1 block">
 {comment.timestamp?.toDate?.()
 ? comment.timestamp.toDate().toLocaleString()
 : new Date().toLocaleString()}
{/* { new Date(comment.timestamp).toLocaleString()} */}
</span>
</div>
 </div>
 </div>
))
: selectedPost.comments?.map((comment, index) => (
 <div key={index} className="p-4 border-b">
 <div className="flex items-start space-x-3">
<Avatar src={comment.userPhoto} />
 <div className="flex-1">
 <div className="bg-gray-50 rounded-lg p-3">
 <span className="font-semibold block">{comment.userName}</span>
<p className="text-gray-800">{comment.text}</p>
</div>
<span className="text-xs text-gray-500 mt-1 block">
{comment.timestamp?.toDate?.()
? comment.timestamp.toDate().toLocaleString()
: new Date().toLocaleString()}
 </span>
</div>
 </div>
 </div>
 ))}
            </div>

            {/* Comment Input */}
            <div className="border-t p-3 md:p-4">
                <div className="flex space-x-2">
                    <Input.TextArea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        className="flex-1 focus:border-violet-500 hover:border-violet-400"
                        maxLength={500}
                    />
                    <Button
                        type="primary"
                        onClick={() => selectedPost.isNews ? handleNewsComment(selectedPost.id) : handleComment(selectedPost.id)}
                        disabled={!newComment.trim()}
                        className="bg-violet-600 hover:bg-violet-700"
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    </div>
)}

    </>
  )
}
