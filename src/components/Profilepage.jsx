import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout, Avatar, Tooltip, Button, Typography, Row, Col, Card, Space, 
  Divider, Empty, Input,Mentions,Flex,Modal} from 'antd';
  import Resizer from 'react-image-file-resizer';
import { EditOutlined, UserOutlined, PlusOutlined,ReloadOutlined,LoadingOutlined, SettingOutlined,SaveOutlined,MessageOutlined,FileImageOutlined,TeamOutlined,StarOutlined,ShareAltOutlined } from '@ant-design/icons';
import { SideBar } from './SideBar';
import { useParams,useNavigate } from 'react-router-dom';

import UserContext from './context/context';
import { db } from '../config/firebase';
import { collection,doc,onSnapshot,getDoc ,updateDoc,getDocs,query,where} from 'firebase/firestore';
import { ref,getDownloadURL,uploadBytes,getStorage } from 'firebase/storage';
import { Follow } from './Follow';
import ai from '../hooks/ai';
import ChatContext from './context/ChatContext';
import { UploadPosts } from './UploadPosts';
import { ShowPost } from './ShowPost';
import { ProfileSettings } from './ProfileSettings';
import Loader from './Design/Loader';
import { motion } from 'framer-motion';
import { ShareProile } from './ShareProile';
import { WandSparkles } from 'lucide-react';
const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const {setupdateuser,user}=useContext(UserContext);
  const {setPersonalChats, cname, cimg, cemail,setcname,setcemail,setcimg,setUserId}=useContext(ChatContext)
  const [userstate, setdata] = useState(null); // Initialize as null
  const descriptionInputRef = useRef(null);
  const [description, setDescription] = useState("Tell about you...");
  const { uid } = useParams();
  const [Posttotal, setPosttotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
    const [isowner,setisowner]=useState(true);
  const { suggestions, loading, error, fetchSuggestions } = ai();
  const[load,setload]=useState(false);
  const[load1,setload1]=useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const [active, setActive] = useState(false);
 const navigate=useNavigate();
 const [highlights, setHighlights] = useState([]);
  const [tags, setTags] = useState(" ");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [FriendsCount,setFriendsCount]=useState(0);
  const [inputValue, setInputValue] = useState();
  const [avatarUrl, setAvatarUrl] = useState();
  const [trigger,settrigger]=useState(0);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(3);
  const MOCK_DATA = {
    '@': [
       'techky', 'foodie_life', 'travel_blogger', 
      'fitness_freak', 'music_lover', 'fashion_queen', 'auto_enthusiast', 
      'nature_photographer', 'art_critic', 'film_buff'
    ],
    '#': [
      'travel', 'food', 'fitness', 'music', 'fashion', 'tech', 'cars', 'photography',
      'art', 'trending', 'nature', 'movies', 'summer_vibes', 'instagood', 'explore',
      'innovation', 'gadgets', 'luxury_lifestyle', 'roadtrip', 'adventure', 'healthyliving',
      'sustainability', 'minimalism', 'digitalnomad', 'beachlife', 'urbanexplorer'
    ],
  };
  console.log("uid from params",uid);
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [uid]);

  if (!user) return null;
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.valid === false) {
            navigate('/');
            message.error('User account no longer exists');
            return;
          }
          setdata(userData);
          setAvatarUrl(userData.photoURL);
          setInputValue(userData.displayName);
          setDescription(userData.description || "Tell about you...");
          setTags(userData.tags || "#");
          
          // Move fetchSuggestions here, after we have the userstate data
          if (userData.displayName && uid==user.uid ) {
            fetchSuggestions(
              `Generate 16 unique, stylish, and trendy Instagram-style usernames. The usernames should be creative, include variations with underscores, dots and reflect an aesthetic vibe. Return each username on a new line without numbering or additional information.`,
              0.1,
              16384,
              "llama-v3p1-405b-instruct",
              "chat"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching userstate data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const getposts=async ()=>{
      const postsRef = collection(db, "users", uid, "posts");
      const q = query(postsRef);
      const querySnapshot = await getDocs(q);
      const totalPosts = querySnapshot.size;
      console.log(totalPosts,"totapost");
    setPosttotal(totalPosts);
    }
   

    const getTotalFriends = async () => {
      const notificationRef = collection(db, "users", uid, "notifications");
      const q = query(
          notificationRef,
          where("status", "==", "accepted")
      );
        const querySnapshot = await getDocs(q);
        const totalFriends = querySnapshot.size;
        setFriendsCount(totalFriends); // Assuming you have a state variable for this
    };
    const fetchHighlights = async () => {
      const highlightsRef = collection(db, "users", uid, "highlights");
      const querySnapshot = await getDocs(highlightsRef);
      const highlightsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHighlights(highlightsData);
    };
    if (uid) {
      setisowner((uid===user.uid));
      fetchUserData();
      getTotalFriends();
      getposts();
      fetchHighlights();

    }
  }, [uid,trigger]);
 
  console.log(userstate?.photoURL|| "","userphotp");
 
  const [prefix, setPrefix] = useState('@');
  const onSearch = (_, newPrefix) => {
    setPrefix(newPrefix);
  };
  useEffect(() => {
    if (active && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }

  }, [active]);

 
  
  console.log(suggestions)

  const handleSave = async () => {
    
    const userDocRef = doc(db, 'users', userstate.uid);
    await updateDoc(userDocRef, {
      description: description,
      tags: tags
    });
   
    setActive(false);
  };


  const inputStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    border: active ? '1px solid #d9d9d9' : 'none',
    padding: '4px 11px',
    borderRadius: '2px',
  };
  const handleMentionsChange = (value) => {
    setTags(value);
  };
  const handleSave1 = async () => {
    setload1(true);
    const userDocRef = doc(db, 'users', userstate.uid);
    await updateDoc(userDocRef, {
      photoURL: avatarUrl,
      username: inputValue,
      

    });
  
  setupdateuser(i=>(i+1));
    setload1(false);
    // Add logic to save the updated profile information
    setIsModalVisible(false);
  };
  const handleImageUpload = async (e) => {
    setload(true);
   
    const file = e.target.files[0];
    const resizedImage = await new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, 
        300, 
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${userstate.uid}`);
    await uploadBytes(storageRef, resizedImage);
    const downloadURL = await getDownloadURL(storageRef);
    setAvatarUrl(downloadURL);
    setload(false);
    console.log("Image uploaded, URL:", downloadURL);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const cycleNextSuggestion = () => {
    const sd=suggestions.slice(1,suggestions.length-2)
    if (sd && sd.length > 0) {
      const nextIndex = (currentSuggestionIndex + 1) % sd.length;
      const nextSuggestion = sd[nextIndex];
      
      setCurrentSuggestionIndex(nextIndex);
      setInputValue(nextSuggestion.replace(/^\s*\d*\.\s*/, ""));

    }
  };

  const Navigatedm=()=>{
   
      const userId = (user.uid+uid).split("").sort().join("");
      console.log("sorted user",userId);
      setUserId(userId);
      setPersonalChats(userId);
      setcname(userstate.displayName);
      setcemail(userstate.email);
      setcimg(userstate.photoURL);

      
navigate('/ChatDm')
 
  }
  const modalStyles = {
    content: {
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    header: {
      borderBottom: '2px solid #8b5cf6',
      paddingBottom: '12px',
    },
    footer: {
      borderTop: '2px solid #8b5cf6',
      paddingTop: '12px',
    }
  };
  if (isLoading || !userstate) {
    return (
      <Loader/>
    );
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 md:ml-[220px]">
      <SideBar />
      <ShareProile 
  isVisible={isShareModalVisible}
  onClose={() => setIsShareModalVisible(false)}
  userImage={user.photoURL}
  userName={user.displayName}
  profileUrl={window.location.href}
/>
      <Modal
        title={<Text className="text-xl font-bold text-violet-800">Edit Profile</Text>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        className="profile-modal"
        style={modalStyles.content}
        footer={[
          <Button
            key="save"
            type="primary"
            onClick={handleSave1}
            className="bg-violet-600 hover:bg-violet-700 border-none h-10 px-6"
          >
            {!load1 ? (
              <span className="flex items-center gap-2">
                <SaveOutlined /> Save
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LoadingOutlined /> Saving...
              </span>
            )}
          </Button>,
        ]}
      >
        <Space direction="vertical" align="center" className="w-full">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar
              size={120}
              src={avatarUrl}
              className="border-4 border-violet-200 hover:border-violet-400 transition-all duration-300"
            />
            {!load ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer border-2 border-violet-200"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                <EditOutlined className="text-violet-600 text-lg" />
              </motion.div>
            ) : (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-violet-200">
                <LoadingOutlined className="text-violet-600 text-lg" />
              </div>
            )}
          </motion.div>
        
          <input
            type="file"
            accept='image/*'
            id="imageUpload"
            hidden
            onChange={handleImageUpload}
          />
  
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className="rounded-lg border-2 border-violet-200 hover:border-violet-400 focus:border-violet-600 px-4 py-2 mt-4"
            suffix={
              <WandSparkles
                onClick={cycleNextSuggestion}
                className="text-violet-600 hover:text-violet-800 cursor-pointer"
              />
            }
          />
        </Space>
      </Modal>
      <Content className="p-6">
      {/* Profile Cards Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Profile Card with Avatar */}
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4  md:w-1/3"
    >
      <Space direction="vertical" align="center" className="w-full">
        <Avatar
          size={120}
          src={avatarUrl}
          className="border-4 border-violet-200 hover:border-violet-400 transition-all duration-300"
        />
        <Flex justify='space-between' align='center' style={{width: '100%'}}>
          <Title level={4} className="text-violet-800 mb-0">
            {!userstate.username ? userstate.displayName : userstate.username}
          </Title>
          {isowner && (
            <EditOutlined
              onClick={() => setIsModalVisible(true)}
              className="text-violet-600 hover:text-violet-800 hover:scale-110 transition-all duration-300 text-lg cursor-pointer"
            />
          )}
        </Flex>
        <Flex gap={8} className="mt-2 relative">
  {/* Share Button */}
  <motion.div
  whileHover={{ scale: 1.05 }}
  onClick={() => setIsShareModalVisible(true)}
  className="absolute top-[-180px] right-[-25px] sm:right-[-65px] flex items-center gap-2 bg-violet-50 px-3 py-1 rounded-full cursor-pointer"
>




    <ShareAltOutlined className="text-violet-600" />
    <Text className="text-violet-800 font-medium">Share</Text>
  </motion.div>

  {/* Existing Post Count */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 bg-violet-50 px-3 py-1 rounded-full"
  >
    <FileImageOutlined className="text-violet-600" />
    <Text className="text-violet-800 font-medium">{Posttotal} posts</Text>
  </motion.div>

  {/* Existing Friends Count */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 bg-violet-50 px-3 py-1 rounded-full"
  >
    <TeamOutlined className="text-violet-600" />
    <Text className="text-violet-800 font-medium">{FriendsCount} friends</Text>
  </motion.div>
</Flex>

      </Space>
    </motion.div>

    {/* Second Card - User Details */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 flex-1"
    >
      <Card.Meta
        description={
          <>
            <ProfileSettings/>
            <Title level={4} style={inputStyle}>{userstate.displayName.toUpperCase()}</Title>
            <Input
              ref={descriptionInputRef}
              readOnly={!active}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
            <Mentions
              readOnly={!active}
              style={inputStyle}
              placeholder="# to mention tag"
              prefix={['@', '#']}
              value={tags}
              onChange={handleMentionsChange}
              onSearch={onSearch}
              options={(MOCK_DATA[prefix] || []).map((value) => ({
                key: value,
                value,
                label: value,
              }))}
            />
            <Flex gap={4} className="mt-4 justify-center">
              {isowner ? (
                <>
                  <button
                    onClick={() => active ? handleSave() : setActive(true)}
                    className='bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium
                              py-2 px-4 rounded-full text-sm
                              transition-all duration-200 ease-in-out shadow-md
                              hover:shadow-violet-200 hover:scale-105
                              flex items-center justify-center gap-2'
                  >
                    <EditOutlined className='text-base' />
                    <span>{active ? 'Save' : 'Edit'}</span>
                  </button>
                  <UploadPosts trigger={trigger} settrigger={settrigger} Uid={uid} />
                </>
              ) : (
                <>
                  <Follow
                    uid1={userstate.uid}
                    username1={userstate.displayName}
                    userurl1={userstate.photoURL}
                  />
                  <button
                    className='bg-gradient-to-r from-violet-400 to-purple-500 text-white font-medium
                              py-2 px-4 rounded-full text-sm
                              transition-all duration-200 ease-in-out shadow-md
                              hover:shadow-violet-200 hover:scale-105
                              flex items-center justify-center gap-2'
                    onClick={Navigatedm}
                  >
                    <MessageOutlined className='text-base' />
                    <span>Message</span>
                  </button>
                </>
              )}
            </Flex>
          </>
        }
      />
    </motion.div>
  </div>

      {/* Bio Section */}
     

      {/* Highlights Section */}
      <div className="mb-6">
        <Space
          direction="vertical"
          size="large"
          className="w-full border-2 border-violet-200 rounded-xl p-6 bg-white"
        >
          <Flex align="center" className="mb-4 border-b-2 border-violet-100 pb-3">
            <StarOutlined className="text-violet-600 text-xl mr-2" />
            <Title level={4} className="text-violet-800 m-0">Highlights</Title>
          </Flex>
          {highlights.length > 0 ? (
            <Row gutter={[16, 16]} className="w-full m-0">
              {highlights.map((highlight) => (
                <Col xs={12} sm={8} md={6} lg={4} key={highlight.id}>
                  <motion.div whileHover={{ scale: 1.05 }} className="group">
                    <Flex vertical align="center" className="p-3">
                      <Avatar
                        shape="circle"
                        size={64}
                        src={highlight.mediaUrl}
                        className="border-4 border-violet-300 group-hover:border-violet-500 transition-all duration-300"
                      />
                      <Text className="mt-2 font-medium text-violet-700 group-hover:text-violet-900">
                        {highlight.title}
                      </Text>
                    </Flex>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<Text className="text-violet-600">No highlights yet</Text>}
            />
          )}
        </Space>
      </div>

      {/* Posts Section */}
      <div>
        <Typography.Title level={3}>Posts</Typography.Title>
        <div className="mt-5">
          <ShowPost settrigger={settrigger} trigger={trigger} uid={uid}/>
        </div>
      </div>
    </Content>
    </Layout>
  );
  
};

export default ProfilePage;
