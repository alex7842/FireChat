import React, { useEffect, useState } from 'react'
import Typography from 'antd/es/typography/Typography'
import GroupContext from './context/GroupContext'
import { useContext } from 'react'
import { Flex} from 'antd';
import { Button, Popover,Modal,Form,Input,Select,message} from 'antd';
import { MessageSquare,ArrowRight,Plus } from 'lucide-react';

import { doc,collection,getDocs,addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import UserContext from './context/context'
import ChatContext from './context/ChatContext';
export const CommunityGroup = ({ onGroupSelect}) => {
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
    <div className="p-4 max-w-3xl mx-auto">
    {/* Create Group Modal */}
    <Modal 
      title="Create New Group" 
      open={isModalOpen} 
      footer={null} 
      onCancel={handleCancel}
      className="rounded-lg"
    >
      <Form
        {...formItemLayout}
        form={form}
        variant="filled"
        className="max-w-lg mx-auto"
        onFinish={onFinish}
      >
        <Form.Item
          label="Group Name"
          name="GroupName"
          rules={[{ required: true, message: 'Please input group name!' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>
  
        <Form.Item
          label="Description"
          name="Description"
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <Input.TextArea className="rounded-md" />
        </Form.Item>
  
        <Form.Item
          label="Select Members"
          name="Members"
          rules={[{ required: true, message: 'Please select members!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select Members"
            value={selectedItems}
            onChange={setSelectedItems}
            className="w-full"
            options={filteredOptions.map((item) => ({
              value: item.displayName,
              label: (
                <div className="flex items-center gap-2 p-1">
                  <img 
                    src={item.photoURL} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{item.displayName}</span>
                </div>
              ),
            }))}
          />
        </Form.Item>
  
        <Form.Item className="flex justify-end">
          <Button 
            type="primary" 
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Create Group
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  
    {/* Community Chat Section */}
    <div 
      className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl mb-8 cursor-pointer
                 transform hover:scale-105 transition-all duration-300 shadow-lg"
      onClick={() => {
        setgroup('allowchat');
        if (onGroupSelect) {
          onGroupSelect({ uid: "1", displayName: "anonymous", photoURL: "ddj", email:"dummy@gmail.com" });
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full">
            <MessageSquare className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Community Chat</h2>
            <p className="text-blue-100">Join the conversation with everyone</p>
          </div>
        </div>
        <ArrowRight className="w-6 h-6 text-white" />
      </div>
    </div>
  
    {/* Groups Section */}
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Your Groups</h3>
        <Button 
          onClick={Creategroup}
          className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 
                     transition-colors rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>
  
      <div className="space-y-3">
        {grpmessage
          .filter(user1 => user1.members.includes(user.displayName))
          .map((user1, i) => (
            <div
              key={i}
              onClick={() => {
                setgroup("group");
                setgroupid(user1.id);
                setgroupname(user1.groupname);
                setgrouplogo(user1.logo);
                setselectedgroupid(user1.id);
                if (onGroupSelect) {
                  onGroupSelect({ 
                    uid: "1", 
                    displayName: "anonymous", 
                    photoURL: "ddj", 
                    email:"dummy@gmail.com" 
                  });
                }
              }}
              className="flex items-center gap-4 p-3 rounded-lg cursor-pointer
                         hover:bg-gray-50 transition-all duration-200
                         border border-gray-100 hover:border-blue-200"
            >
              <img
                src={user1.logo}
                alt={user1.groupname}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h4 className="font-medium text-gray-800 capitalize">
                  {user1.groupname}
                </h4>
                <p className="text-sm text-gray-500">
                  {user1.members.length} members
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
    {contextHolder}
  </div>
  
  )
}
