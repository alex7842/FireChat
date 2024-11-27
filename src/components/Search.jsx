import React,{useState,useRef, useEffect}from 'react';
import { SearchOutlined } from '@ant-design/icons';
import GroupContext from './context/GroupContext';
import { useContext } from 'react';
import { Flex,Layout,Spin } from 'antd';
import { LoadingOutlined, MessageOutlined} from '@ant-design/icons';
import UserContext from './context/context';
import { getDocs,collection,query,where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SideBar } from './SideBar';
import { CircleChevronRight } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { Popover } from 'antd';
export const Search = () => {
    const inp=useRef();
    const {users,setUsers,loading, setLoading}=useContext(GroupContext)
    const messageref=collection(db,"users")
    const [value,setvalue]=useState('');
    const { user} = useContext(UserContext);
    const fetchUsers = async () => {
        try {
          setLoading(true);
          const querySnapshot = await getDocs(messageref);
          const usersList = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user1 => user1.uid !== user.uid);
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
        finally{
          setLoading(false);
        }
      };
  useEffect(() => {
    fetchUsers();
  }, []);
    
  const handlevalue = async (v) => {
    if (v) {
      const startLetter = v.toUpperCase();
      const endLetter = startLetter + '\uf8ff';
      const q = query(
        collection(db, 'users'),
        where('displayName', '>=', startLetter),
        where('displayName', '<', endLetter)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setUsers(data);
    } else {
      // When search is empty, show all users from context
      const querySnapshot = await getDocs(collection(db, "users"));
      const allUsers = querySnapshot.docs
      .map(doc => doc.data())
      .filter(userData => userData.uid !== user.uid);
    
    setUsers(allUsers);
    
    }
  };
  
    const isActive = (user1) => {
        if (!user1.lastactive) return false;
        
        const now = new Date();
        
        const lastActiveDate = user1.lastactive.toDate();
        
        // Check if last active was today
        const isToday = lastActiveDate.toDateString() === now.toDateString();
        
        // Check if last active was within the last 2 minutes
        const twoMinutesAgo = now.getTime() - 200000;
        
        const isWithinTwoMinutes = lastActiveDate.getTime() > twoMinutesAgo;
      
        // User is active if they were active today AND within the last 2 minutes
        return isToday && isWithinTwoMinutes;
      };
     // console.log(users);
 
     return (
      <div className="flex min-h-screen bg-gray-50 md:ml-[220px]">
          <SideBar />
          <div className="flex-1">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="min-h-screen p-4 md:p-8"
              >
                  {/* Search Bar */}
                  <div className="max-w-xl mx-auto mb-6 mt-8">
    <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
    >
        <input
            type="search"
            ref={inp}
            id="input"
            className="w-full p-3 pl-10 text-base rounded-lg border-2 border-violet-100 
            focus:ring-2 focus:ring-violet-200 focus:border-violet-300 
            transition-all shadow-md bg-white placeholder-violet-300"
            onChange={() => handlevalue(document.getElementById('input').value)}
            placeholder="Search users..."
        />
        <motion.span
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => inp.current.focus()}
        >
            
        </motion.span>
    </motion.div>
</div>

  
                  <div className="container mx-auto px-4">
                      {loading ? (
                          <div className="flex justify-center p-8">
                              <Spin size="large" />
                          </div>
                      ) : users.length > 0 ? (
                          <motion.ul
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                          >
                              {users.map(user1 => {
                                  const userIsActive = isActive(user1);
                                  const UserCard = (
                                      <motion.li
                                          key={user1.id}
                                          className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                                          whileHover={{ scale: 1.02 }}
                                          layout
                                      >
                                          <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-4">
                                                  <div className="relative">
                                                      <motion.img
                                                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                                          src={user1.photoURL}
                                                          alt={user1.displayName}
                                                          whileHover={{ scale: 1.1 }}
                                                      />
                                                      {userIsActive && (
                                                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                                      )}
                                                  </div>
                                                  <div>
                                                      <p className="font-semibold text-gray-800 text-lg">
                                                          {user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}
                                                      </p>
                                                      {userIsActive && (
                                                          <span className="text-sm text-green-600">Active now</span>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      </motion.li>
                                  );
  
                                  return (
                                      <div key={user1.id}>
                                          <div className="hidden md:block">
                                              <Popover
                                                  content={
                                                      <div className="p-4 bg-white rounded-lg shadow-lg">
                                                          <h3 className="font-bold text-lg mb-2">{user1.displayName}</h3>
                                                          <p className="text-sm text-gray-600 mb-1">Email: {user1.email}</p>
                                                          <p className="text-sm text-gray-600">Status: {userIsActive ? 'Online' : 'Offline'}</p>
                                                      </div>
                                                  }
                                                  placement="right"
                                                  trigger={['hover']}
                                              >
                                                  {UserCard}
                                              </Popover>
                                          </div>
                                          <div className="md:hidden">
                                          <Popover
                content={
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-2">{user1.displayName}</h3>
                        <p className="text-sm text-gray-600 mb-1">Email: {user1.email}</p>
                        <p className="text-sm text-gray-600">Status: {userIsActive ? 'Online' : 'Offline'}</p>
                    </div>
                }
                placement="bottom"
                trigger={['hover']}
            >
                {UserCard}
            </Popover>
                                          </div>
                                      </div>
                                  );
                              })}
                          </motion.ul>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-64">
                              <img
                                  src="/no-results.svg"
                                  alt="No results"
                                  className="w-48 h-48 mb-4"
                              />
                              <p className="text-xl text-gray-500">No users found</p>
                          </div>
                      )}
                  </div>
              </motion.div>
          </div>
      </div>
  );
  
    }
     