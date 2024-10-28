import React, { useEffect, useState } from 'react'
import Typography from 'antd/es/typography/Typography'
import GroupContext from './context/GroupContext'
import { useContext } from 'react'
import { Flex} from 'antd';
import { Button, Popover,Modal,Form,Input,Select,message} from 'antd';


import { doc,collection,getDocs,addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import UserContext from './context/context'
import ChatContext from './context/ChatContext';
export const CommunityGroup = () => {
  const {setgroup,isgroup,setgroupid,setgroupname,setgrouplogo,setselectedgroupid,setgroupdetails,setisgroup,users}=useContext(GroupContext)
  const {personalChats, setPersonalChats,fetchgroup,setfetchgroup}=useContext(ChatContext)
  const { user } = useContext(UserContext);
  const usergroup = collection(db, "Groupusers");
  const [messageApi, contextHolder] = message.useMessage();
  const [grpmessage,setgrpmessage]=useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = users.filter((o) => o.uid!==user.uid && !selectedItems.includes(o));
  const date = new Date();
// console.log(date); // Output the current date and time

// Format the date as a string in 'YYYY-MM-DD' format
const dateString = date.toISOString().split('T')[0];

// Format the time in 12-hour format with 'HH:MM AM/PM'
let hours = date.getHours();
let minutes = date.getMinutes();
const period = hours >= 12 ? 'PM' : 'AM';

if (hours > 12) {
    hours -= 12;
} else if (hours === 0) {
    hours = 12;
}

const timeString = `${hours}:${minutes} ${period}`;

// Extract day and time
const day = dateString; // 'YYYY-MM-DD'
const time = timeString; // 'HH:MM AM/PM'

 useEffect(()=>{
  const fetchUsers = async () => {
    try {
   
      const querySnapshot = await getDocs(usergroup);
      const usersList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
      setgroupdetails(usersList);
    setgrpmessage(usersList);
    console.log("grpeasge",grpmessage)
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };
 fetchUsers();
  
 },[isgroup,fetchgroup])
 const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
 const onFinish = async (values) => {
  setIsModalOpen(false);
  
  try{
  await addDoc(usergroup, {  
   groupname: values['GroupName'],
    logo: 'https://th.bing.com/th/id/OIP.lTpUAgvvRRvPlwWWts2UNwHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5',
    members: [...values['Members'], user.displayName],
   description:values['Description'] || '',
   admin:user.displayName,
    day,
    time,
    date
  });
  setisgroup(true);
  setfetchgroup(i=>i+1);
  messageApi.success('Group Created Successfully');
  
  

}
catch(e){
  messageApi.error('Error Creating Group');
console.log("Error",e)
}


  console.log('Received values of form:',[...values['Members'], user.displayName]);
  
  form.resetFields();
};
 const showModal = () => {
  setIsModalOpen(true);
};const handleCancel = () => {
  setIsModalOpen(false);
};
 const Creategroup=()=>{
  // messageApi.info('Hello, Ant Design!');
  showModal();
}

  return (
    <div>
       <Modal title="Basic Modal" open={isModalOpen}  footer={[
        
      ]} onCancel={handleCancel}>
        <Form
  {...formItemLayout}
  form={form}
  variant="filled"
  style={{
    maxWidth: 600,
  }}
  onFinish={onFinish}
>
  <Form.Item

    label="Group Name"
    name="GroupName"
    rules={[
      {
        required: true,
        message: 'Please input!',
      },
    ]}
  >
    <Input />
  </Form.Item>

 

  <Form.Item
    label="Description"
    name="Description"
    rules={[
      {
        required: true,
        message: 'Please input!',
      },
    ]}
  >
    <Input.TextArea />
  </Form.Item>

  

  <Form.Item
    label="Select Members"
    name="Members"
    rules={[
      {
        required: true,
        message: 'Please input!',
      },
    ]}
  >
   <Select
    mode="multiple"
    placeholder="Select Members"
    value={selectedItems}
    onChange={setSelectedItems}
    style={{
      width: '100%',
    }}
    options={filteredOptions.map((item) => ({
      value: item.displayName,
      label: ( <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={item.photoURL} alt="Avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }} />
      {item.displayName}
    </div>),
    }))}
  />
  </Form.Item>

  <Form.Item
    wrapperCol={{
      offset: 6,
      span: 16,
    }}
  >
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>
    </Modal>
       <br/>
  
        <Typography.Text style={{fontSize:22,color:'blue',cursor:'pointer'}} onClick={() =>setgroup('allowchat')}>Community Chat 📢</Typography.Text>
        <br/>
        <Flex>
        <Typography.Text>GROUPS</Typography.Text>
        {contextHolder}
        <Flex>  <Flex><Button onClick={Creategroup}>Create Group</Button></Flex></Flex>
        </Flex>

        <br/>
        {grpmessage
  .filter(user1 => user1.members.includes(user.displayName))
  .map((user1, i) => (
    <Flex key={i} gap={7}  onClick={() => {
          setgroup("group");
          setgroupid(user1.id);
          setgroupname(user1.groupname);
          setgrouplogo(user1.logo);
         setselectedgroupid(user1.id);
        
          console.log("selected id:", user1.id);
        }}>
      <img
       
        className='userimg'
        src={user1.logo}
        alt={user1.groupname}
      />
      <p>{user1.groupname.charAt(0).toUpperCase() + user1.groupname.slice(1)}</p>
    </Flex>
  ))}

        </div>
  )
}
