import React, { useContext, useState, useEffect } from 'react'
import UserContext from './context/context';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { SideBar } from './SideBar';
import { Layout } from 'antd';

export const Notifications = () => {
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const notificationRef = collection(db, "users", user.uid, "notifications");
            const querySnapshot = await getDocs(notificationRef);
            const notificationList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Sort notifications by timestamp in descending order
            const sortedNotifications = notificationList.sort((a, b) => 
                b.timestamp.toMillis() - a.timestamp.toMillis()
            );
            
            setNotifications(sortedNotifications);
        };
    
        fetchNotifications();
    }, [user.uid]);
    

    const handleRequest = async (notificationId, status) => {
        const notificationRef = doc(db, "users", user.uid, "notifications", notificationId);
        await updateDoc(notificationRef, {
            status: status
        });

        // Update UI immediately after status change
        setNotifications(notifications.map(notification => 
            notification.id === notificationId 
                ? {...notification, status: status}
                : notification
        ));
    };

    return (
        <>
         <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <SideBar/>
        <div className="p-4  max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div key={notification.id} 
                         className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={notification.senderPhoto} 
                                alt="sender" 
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-semibold">{notification.message}</p>
                                <p className="text-sm text-gray-500">
                                    {notification.status}
                                </p>
                            </div>
                        </div>
                        
                        {notification.status === 'pending' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleRequest(notification.id, 'accepted')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRequest(notification.id, 'rejected')}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        </Layout>
        </>
    );
};
