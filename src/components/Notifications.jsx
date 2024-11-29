import React, { useContext, useState, useEffect } from 'react'
import UserContext from './context/context';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { SideBar } from './SideBar';
import { Layout } from 'antd';
import { AnimatedList } from './ui/animated-list';
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
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <SideBar/>
            <div className="p-4 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">Notifications</h2>
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                    <svg 
                      className="w-64 h-64 text-gray-300" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mt-6">No Notifications Yet</h3>
                    <p className="text-gray-500 mt-2">You're all caught up! Check back later.</p>
                  </div>
                ) : (
                    <AnimatedList delay={800} className="space-y-4" key="notification-list">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-lg shadow-md flex items-center justify-between border border-violet-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={notification.senderPhoto}
                                        alt="sender"
                                        className="w-12 h-12 rounded-full border-2 border-violet-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{notification.message}</p>
                                        <p className="text-sm text-violet-600">
                                            {notification.status}
                                        </p>
                                    </div>
                                </div>
                                
                                {notification.status === 'pending' && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRequest(notification.id, 'accepted')}
                                            className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-4 py-2 rounded-md hover:from-violet-600 hover:to-violet-700 transition-all"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRequest(notification.id, 'rejected')}
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md hover:from-red-600 hover:to-red-700 transition-all"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </AnimatedList>
                )}
            </div>
        </Layout>
    );
};