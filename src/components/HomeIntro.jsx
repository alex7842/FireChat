
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react';
import { Layout, Menu, Avatar, List, Spin,Row, Col, Card, Carousel, Divider, Typography,Flex} from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
  PlaySquareOutlined,
  MessageOutlined,
  HeartOutlined,
  PlusSquareOutlined,
  UserOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatContext from './context/ChatContext';
import ProfilePage from './Profilepage';
import { SideBar } from './SideBar';

const { Header, Content, Sider } = Layout;


const HomeIntro = () => {
     const {page,setpage}=useContext(ChatContext)
    const postData = [
        // Add your post data here
        { id: 1, author: 'indiatoday', content: 'Fungus found in patties', avatar: 'https://via.placeholder.com/150' },
        { id: 2, author: 'techcrunch', content: 'Latest tech news', avatar: 'https://via.placeholder.com/150' },
        { id: 3, author: 'techcrunch', content: 'Latest tech news', avatar: 'https://via.placeholder.com/150' }, 
        { id: 4, author: 'techcrunch', content: 'Latest tech news', avatar: 'https://via.placeholder.com/150' },
        
        // Add more data as needed
      ];
      
      const suggestedUsers = [
        { id: 1, name: 'haicle0605', avatar: 'https://via.placeholder.com/150' },
        { id: 2, name: '_._.agnes._._', avatar: 'https://via.placeholder.com/150' },
        // Add more suggested users as needed
      ];
      
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

    const navigate=useNavigate()
    const handleclick=(e)=>{
      switch(e){
        case 1:
        navigate('/ChatDm')
        break;
      }
    }
    const [selectedKey, setSelectedKey] = useState('home');

  const [posts, setPosts] = useState(postData);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchMorePosts = () => {
    if (posts.length >= 50) {
      setHasMorePosts(false);
      return;
    }
    // setTimeout(() => {
    //   setPosts(posts.concat(postData));
    // }, 1500);
  };
  
    return (
      <Layout>
    
     
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
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={hasMorePosts}
                    loader={<Spin />}
                    endMessage={<p style={{ textAlign: 'center' }}><b>Yay! You have seen it all</b></p>}
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={posts}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item.author}
                            description={item.content}
                          />
                        </List.Item>
                      )}
                    />
                  </InfiniteScroll>
                </Col>
               
                <Col span={8}>
                  <Card title="Suggested for you">
                    <List
                      itemLayout="horizontal"
                      dataSource={suggestedUsers}
                      renderItem={user => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={user.avatar} />}
                            title={user.name}
                          />
                          <div>Follow</div>
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

    
   
  