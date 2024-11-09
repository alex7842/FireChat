import React, { useContext, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import GroupContext from './context/GroupContext';
import UserContext from './context/context';
import { Share2,Linkedin,Instagram,Twitter} from 'lucide-react';
import { motion } from 'framer-motion';
import { collection,setDoc,addDoc,doc } from 'firebase/firestore';
import { db } from '../config/firebase';
export const Share = ({  Sharemodel,SharePost }) => {
   //console.log("Sharepost",SharePost);
    const { users } = useContext(GroupContext);
    const { user } = useContext(UserContext);
    const [form] = Form.useForm();
    const [selectedItems, setSelectedItems] = useState([]);

    const filteredOptions = users.filter((o) => o.uid !== user.uid && !selectedItems.includes(o));
    const userMapping = {};
    filteredOptions.forEach(user => {
        userMapping[user.displayName] = user.uid;
    });
    const onFinish = async (values) => {
        try {
            // Get selected UIDs from form values
            const selectedUIDs = values.Members;
            const date = new Date();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';

            if (hours > 12) {
                hours -= 12;
            } else if (hours === 0) {
                hours = 12;
            }

            const timeString = `${hours}:${minutes} ${period}`;
            // Create chat rooms for each selected user
            for (const uid of selectedUIDs) {
                // Create unique chat ID
                const chatId = (user.uid + uid).split("").sort().join("");
                
                // Create/update chat user document
                const docRef = doc(db, "chatusers", chatId);
                await setDoc(docRef, { 
                    uid: user.uid, 
                    name: user.displayName 
                });
    
                // Create chatroom subcollection
                const userDocRef = doc(db, "chatusers", chatId);
                const chatRoomSubColRef = collection(userDocRef, "chatroom");
    
                // Add shared post as a message
                const messageData = {
                    text: SharePost.isNews?SharePost.title:SharePost.caption,
                    email: user.email,
                    
                    day: new Date().toLocaleDateString(),
                    time: timeString,
                    date: new Date(),
                    uid: SharePost.isNews ? SharePost.id : SharePost.uid,
                    post: true,
                    author: SharePost.author,
                    caption: SharePost.isNews?SharePost.caption:`${SharePost.username }  ${SharePost.caption}`,
                    id: SharePost.id,
                    isNews: SharePost.isNews?true:false,
                    mediaUrl: SharePost.mediaUrl,
                    publishedAt: SharePost.isNews?SharePost.publishedAt:SharePost.timestamp,
                    sourceName: SharePost.isNews?SharePost.sourceName:SharePost.username,
                    timestamp: SharePost.timestamp,
                    title: SharePost.isNews ? SharePost.title : SharePost.caption
                  };
                  console.log("Message Data:", messageData);    
                  await addDoc(chatRoomSubColRef, messageData);
                  
            }
            message.success("Post shared successfully!");
            console.log("Post shared successfully!");
            Sharemodel(false);
        } catch (error) {
            console.error("Error sharing post:", error);
        }
    };
    

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6"
        >
            <h2 className="text-2xl font-semibold mb-6 text-primary">Share with Others</h2>
            
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4"
            >
                <Form.Item
                    label="Select Members"
                    name="Members"
                    rules={[{ required: true, message: 'Please select members!' }]}
                >
          <Select
    mode="multiple"
    placeholder="Select Members"
    value={selectedItems}
    onChange={(values) => {
        // Convert any displayNames to UIDs
        const uids = values.map(value => userMapping[value] || value);
        setSelectedItems(uids);
    }}
    className="w-full"
    options={filteredOptions.map((item) => ({
        value: item.uid,
        label: (
            <div className="flex items-center gap-2">
                <img
                    src={item.photoURL}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                />
                <span>{item.displayName}</span>
            </div>
        ),
    }))}
/>

                </Form.Item>

                <div className="flex justify-end">
                    <Button 
                        type="primary"
                        htmlType="submit"
                        className="bg-primary hover:bg-primary/90 text-white"
                        icon={<Share2 className="w-4 h-4" />}
                    >
                        Send
                    </Button>
                </div>
            </Form>

            <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">Or share via social media</p>
                <div className="flex gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                        <Instagram className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-[#25D366] text-white"
                    >
                        <Linkedin className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-[#1DA1F2] text-white"
                    >
                        <Twitter className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
