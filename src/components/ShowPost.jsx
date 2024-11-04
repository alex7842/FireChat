import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Popconfirm, Avatar } from 'antd';
import { HeartFilled, HeartOutlined, ShareAltOutlined, CommentOutlined, DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc, addDoc, Timestamp,getDoc,setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useContext } from 'react';
import UserContext from './context/context';
import ChatContext from './context/ChatContext';

export const ShowPost = ({ uid,trigger,settrigger }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(UserContext);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
const [highlightTitle, setHighlightTitle] = useState('');
const [highlights, setHighlights] = useState([]);
const {sethomereload}=useContext(ChatContext);


  useEffect(() => {
    fetchPosts();
   
  }, [uid,trigger]);

  

  const fetchPosts = async () => {
    const postsRef = collection(db, "users", uid, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(postsData);
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "users", uid, "posts", postId));
      message.success('Post deleted successfully');
      localStorage.removeItem('cachedPosts');
  // Reset counter to 0 instead of incrementing
  sethomereload(0);
      fetchPosts();
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to delete post');
    }
    
  };

  const handleLike = async (post) => {
    // Create a likes subcollection for each post to track user likes
    const postLikesRef = collection(db, "users", uid, "posts", post.id, "likes");
    const userLikeRef = doc(postLikesRef, user.uid);
    
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
      const updatedPosts = posts.map(p =>
        p.id === post.id ? {...p, likes: newLikeCount} : p
      );
      setPosts(updatedPosts);
  
      if (selectedPost?.id === post.id) {
        setSelectedPost(prev => ({...prev, likes: newLikeCount}));
      }
  
      // Trigger animation
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 1000);
  
      // Update database
      const postRef = doc(db, "users", uid, "posts", post.id);
      
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
      setPosts(posts);
      setSelectedPost(selectedPost);
    }
  };
  
  
  const handleComment = async (postId) => {
    if (!newComment.trim()) return;

    const postRef = doc(db, "users", uid, "posts", postId);
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

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), comment] }
          : post
      ));

      setNewComment('');
      message.success('Comment added successfully');
    } catch (error) {
      message.error('Failed to add comment');
    }
  };

  return (
    <>
    <Modal
    title="Add to Highlights"
    open={highlightModalVisible}
    onCancel={() => setHighlightModalVisible(false)}
    onOk={async () => {
      if (selectedPost && highlightTitle) {
        const highlightRef = collection(db, "users", uid, "highlights");
        await addDoc(highlightRef, {
          title: highlightTitle,
          mediaUrl: selectedPost.mediaUrl,
          postId: selectedPost.id,
          timestamp: Timestamp.now()
        });
        message.success('Added to highlights');
        setHighlightModalVisible(false);
        setHighlightTitle('');
        settrigger((i)=>i+1);
        
      }
    }}
  >
    <Input
      placeholder="Enter highlight title"
      value={highlightTitle}
      onChange={(e) => setHighlightTitle(e.target.value)}
    />
  </Modal>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 p-4 bg-white">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-white"
          >
            {post.type === 'video' ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover brightness-100" />
            ) : (
              <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover brightness-100" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="text-white flex items-center space-x-4">
                <span className="flex items-center">
                  <HeartOutlined className="text-2xl mr-2" /> {post.likes}
                </span>
                <span className="flex items-center">
                  <CommentOutlined className="text-2xl mr-2" /> {post.comments?.length || 0}
                </span>
               
              </div>
            </div>
            
            <div 
              className="absolute inset-0" 
              onClick={() => {
                setSelectedPost(post);
                setModalVisible(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal
  open={modalVisible}
  onCancel={() => setModalVisible(false)}
  width={1000}
  footer={null}
  className="post-modal"
  style={{ top: 20 }}
>
  {selectedPost && (
    <div className="flex max-h-[90vh]">
      {/* Left Side - Media Display */}
      <div className="w-3/5 relative bg-black">
        <div className="flex items-center justify-center h-full">
          {selectedPost.type === 'video' ? (
            <video 
              src={selectedPost.mediaUrl} 
              controls 
              className="max-h-[90vh] w-full object-contain"
            />
          ) : (
            <img 
              src={selectedPost.mediaUrl} 
              alt={selectedPost.caption} 
              className="max-h-[90vh] w-full object-contain"
            />
          )}
        </div>

        {/* Like Animation Overlay */}
        {isHeartAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <HeartFilled 
              className="text-6xl text-red-500 animate-like-heart"
            />
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button
                type="text"
                icon={likedPosts[selectedPost.id] ?
                  <HeartFilled style={{ color: '#ff4d4f' }} /> :
                  <HeartOutlined />
                }
                className="text-white hover:text-red-500 transition-colors"
                onClick={() => handleLike(selectedPost)}
              >
                <span className="ml-1">{selectedPost.likes}</span>
              </Button>
              <Button 
                type="text" 
                icon={<CommentOutlined />} 
                className="text-white hover:text-blue-500 transition-colors"
              >
                <span className="ml-1">{selectedPost.comments?.length || 0}</span>
              </Button>
              <Button 
                type="text" 
                icon={<ShareAltOutlined />} 
                className="text-white hover:text-green-500 transition-colors"
              />
                 {user.uid === uid && (
              <Button
                        type="text" 
          icon={<PlusOutlined />} 
          onClick={() => setHighlightModalVisible(true)}
         className="text-white hover:text-green-500 transition-colors"
        />
                 )}
            </div>
            {user.uid === uid && (
              <Popconfirm
                title="Delete this post?"
                description="This action cannot be undone."
                onConfirm={() => handleDelete(selectedPost.id)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  className="text-white hover:text-red-500 transition-colors"
                />
              </Popconfirm>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Comments and Info */}
      <div className="w-2/5 flex flex-col bg-white">
        {/* Post Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar src={user.photoURL} size={40} />
            <div>
              <span className="font-semibold block">{user.displayName}</span>
              <span className="text-xs text-gray-500">
                {selectedPost.timestamp?.toDate().toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{selectedPost.caption}</p>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto">
          {selectedPost.comments?.map((comment, index) => (
            <div key={index} className="p-4 border-b">
              <div className="flex items-start space-x-3">
                <Avatar src={comment.userPhoto} />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold block">{comment.userName}</span>
                    <p className="text-gray-800">{comment.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {comment.timestamp?.toDate().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input.TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
              maxLength={500}
            />
            <Button
              type="primary"
              onClick={() => handleComment(selectedPost.id)}
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}
</Modal>

    </>
  );
};
