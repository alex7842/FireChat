import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout, Avatar, Tooltip, Button, Typography, Row, Col, Card, Space, 
  Divider, Empty, Input,Mentions,Flex,Modal} from 'antd';
  import Resizer from 'react-image-file-resizer';
import { EditOutlined, UserOutlined, PlusOutlined,ReloadOutlined,LoadingOutlined } from '@ant-design/icons';
import { SideBar } from './SideBar';
import UserContext from './context/context';
import { db } from '../config/firebase';
import { collection,doc,onSnapshot,getDoc ,updateDoc} from 'firebase/firestore';
import { ref,getDownloadURL,uploadBytes,getStorage } from 'firebase/storage';

import ai from '../hooks/ai';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const {user,setupdateuser}=useContext(UserContext);

  console.log("user id",user.uid);

  const [data,setdata]=useState([]);
  const { suggestions, loading, error, fetchSuggestions } = ai();
  const[load,setload]=useState(false);
  const[load1,setload1]=useState(false);
  const [active, setActive] = useState(false);
  const descriptionInputRef = useRef(null);
  const [description, setDescription] = useState("Tell about you...");
  const [tags, setTags] = useState(" ");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);
 
  const [inputValue, setInputValue] = useState(user.username);
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
  console.log(user.photoURL,"userphotp");
  
  const [prefix, setPrefix] = useState('@');
  const onSearch = (_, newPrefix) => {
    setPrefix(newPrefix);
  };
  useEffect(() => {
    if (active && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }

  }, [active]);

  useEffect(() => {
   
    
    
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setdata(userData);
        setDescription(userData.description || "Tell about you...");
        setTags(userData.tags || "#");
      }
    };
    fetchUserData();
   fetchSuggestions(`Generate 20 unique and creative username suggestions for the display name "${user.displayName}". The usernames should follow Instagram-style formats, using underscores, numbers, or slight modifications of the display name. Only return the list of usernames—no additional information, steps, or explanations.
`,1,90);

  }, [user.uid]);
  
  console.log(suggestions)

  const handleSave = async () => {
    
    const userDocRef = doc(db, 'users', user.uid);
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
    const userDocRef = doc(db, 'users', user.uid);
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
    const storageRef = ref(storage, `profileImages/${user.uid}`);
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
    if (suggestions && suggestions.length > 0) {
      const nextIndex = (currentSuggestionIndex + 1) % suggestions.length;
      const nextSuggestion = suggestions[nextIndex];
      
      setCurrentSuggestionIndex(nextIndex);
      setInputValue(nextSuggestion.replace(/^\s*\d*\.\s*/, ""));

    }
  };
  
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <SideBar />
      <Modal
  title="Edit Profile"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={[
    <Button key="save" type="primary" onClick={handleSave1}>
      {!load1 ? 'Save' : 'Saving...'} 
    </Button>,
  ]}
>
  <Space direction="vertical" align="center" style={{width: '100%'}}>
    <div style={{ position: 'relative' }}>
    <Avatar size={100} src={avatarUrl} />

     { !load ?<EditOutlined 
        style={{
          position: 'absolute',
          bottom: 0,
          border:'1px solid #d9d9d9',
          right: 0,
          backgroundColor: 'white',
          borderRadius: '50%',
          padding: '5px',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('imageUpload').click()}
      />:<LoadingOutlined 
      style={{
        position: 'absolute',
        bottom: 0,
        border:'1px solid #d9d9d9',
        right: 0,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '5px',
        cursor: 'pointer'
      }}/>
}
    </div>
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
   
    suffix={
      <ReloadOutlined
        onClick={cycleNextSuggestion}
        style={{ cursor: 'pointer' }}
      />
    }
  />
  </Space>
</Modal>

      <Content style={{ margin: "3%", marginLeft: "5%" }}>
        <Row gutter={[16, 24]}>
          {/* Profile Info Section */}
          <Col xs={24} sm={8}>
  <Space direction="vertical" align="center" style={{width: '100%'}}>
    <Avatar size={148} src={user.photoURL}  />
    <Flex justify='space-between' align='center' style={{width: '100%'}}>
      <Title level={3}>{!user.username?user.displayName:user.username }</Title>
      <EditOutlined onClick={() => setIsModalVisible(true)} shape="round" style={{marginLeft:'14px',cursor:'pointer'}}/>
    </Flex>
    <Text>0 posts</Text>
    <Text>0 followers</Text>
    <Text>0 following</Text>
    <Tooltip title="Follow">
      <Button shape="round" icon={<UserOutlined />} type="default">
        Follow
      </Button>
    </Tooltip>
  </Space>
</Col>

          {/* Profile Bio and Actions */}
          <Col xs={24} sm={16}>
            <Card
              actions={[
                <button
                onClick={() => active ? handleSave() : setActive(true)}
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md flex items-center space-x-2'
              >
                <EditOutlined />
                <span>{active ? 'Save' : 'Edit'}</span>
              </button>,
              
              <button className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md ml-3'>
                Upload Posts
              </button>
              
              
              ]}
            >
              <Card.Meta
                title=""
                description={
                  <>
                  <Title level={4} style={inputStyle}>{user.displayName.toUpperCase()}</Title>
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
                  {/* <Input
                    readOnly={!active}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    style={inputStyle}
                  /> */}
                  {/* <Button
                    icon={<EditOutlined />}
                    onClick={() => active ? handleSave() : setActive(true)}
                    className='bg-blue-500 hover:bg-blue-600 text-white'
                  >
                    {active ? 'Save' : 'Edit'}
                  </Button> */}
                </>
                }
              />
            </Card>

            {/* Highlights Section */}
            <Space direction="vertical" size="large" style={{ marginTop: '24px', width: '100%' }}>
              <Title level={4}>Highlights</Title>
              <Row gutter={[16, 16]}>
                <Col>
                  <Avatar shape="square" size={64} icon={<PlusOutlined />} />
                  <Text className='p-2'>New</Text>
                </Col>
              </Row>
            </Space>
          </Col>
          <Divider />
          <div className='flex align-center justify-center ml-0'>
            <Typography.Title level={3}>Posts</Typography.Title>
            <div className='flex justify-center align-center'>
              <Empty />
            </div>
          </div>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
