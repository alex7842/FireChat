import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout, Avatar, Tooltip, Button, Typography, Row, Col, Card, Space, Divider, Empty, Input,Mentions} from 'antd';
import { EditOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { SideBar } from './SideBar';
import UserContext from './context/context';
import { db } from '../config/firebase';
import { collection,doc,onSnapshot,getDoc ,updateDoc} from 'firebase/firestore';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const {user}=useContext(UserContext);

  console.log("user id",user.uid);

  const [data,setdata]=useState([]);

  const [active, setActive] = useState(false);
  const descriptionInputRef = useRef(null);
  const [description, setDescription] = useState("Tell about you...");
  const [tags, setTags] = useState(" ");
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
    const fetchusername=async ()=>{

      const options = {
        method: 'POST',
        headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
        body: `{"model":"accounts/fireworks/models/llama-v3p1-8b-instruct","prompt":create an username for the user ${user.displayName} like if an user name is john create like j_o_h_n77 like this give me a 10 suggestion ,"images":["<string>"],"max_tokens":16,"logprobs":2,"echo":true,"temperature":1,"top_p":1,"top_k":50,"frequency_penalty":0,"presence_penalty":0,"n":1,"stop":"<string>","response_format":{"type":"json_object","schema":{}},"stream":true,"context_length_exceeded_behavior":"truncate","user":"<string>"}`
      };
      
      fetch('https://api.fireworks.ai/inference/v1/completions', options)
        .then(response => response.json())
        .then(response => console.log("fireworks",response))
        .catch(err => console.error(err));
    }

    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setDescription(userData.description || "Tell about you...");
        setTags(userData.tags || "#");
      }
    };
    fetchUserData();
    fetchusername();
  }, [user.uid]);

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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <SideBar />
      <Content style={{ margin: "3%", marginLeft: "5%" }}>
        <Row gutter={[16, 24]}>
          {/* Profile Info Section */}
          <Col xs={24} sm={8}>
            <Space direction="vertical" align="center">
              <Avatar size={148} src={user.photoURL}  />
              <Title level={3}>{user.displayName}</Title>
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
