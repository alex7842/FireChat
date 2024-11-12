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
    <>
    <Layout>
        <SideBar/>
   <div className="p-4 bg-white rounded-lg shadow">
  <div className="relative mb-4">
    <input
      type="search"
      ref={inp}
      id="input"
      className="search-input w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      onChange={() => handlevalue(document.getElementById('input').value)}
      placeholder="Search users..."
    />
    <span className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          onClick={() => inp.current.focus()}>
      <SearchOutlined />
    </span>
  </div>

  {loading ? (
    <div className="flex justify-center p-4">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
  ) : users.length > 0 ? (
    <ul className="space-y-3 max-h-[400px] overflow-y-auto">
      {users.map(user1 => {
        const userIsActive = isActive(user1);
        return (
          <li 
            key={user1.id} 
            className="user-item p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-gray-100"
          >
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={12}>
                <div className="relative">
                  <img 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                    src={user1.photoURL} 
                    alt={user1.displayName} 
                  />
                  {userIsActive && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {user1.displayName.charAt(0).toUpperCase() + user1.displayName.slice(1)}
                  </p>
                  {userIsActive && (
                    <span className="text-sm text-green-600">Active now</span>
                  )}
                </div>
              </Flex>
            </Flex>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-center text-gray-500 p-4">No users found</p>
  )}
</div>
{/* <h1>hello</h1> */}
</Layout>
    </>
  )
}
