import React, { createContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Timestamp } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const date = new Date();
  const [user, setuser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [updateuser, setupdateuser] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const updatedUser = { ...userData };
          setuser('');
          updatedUser.lastactive=Timestamp.fromDate(date);
          console.log("from usercontext",updatedUser.photoURL);
          setuser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('User data fetched and saved to localStorage:', updatedUser);
        }
      }
    };

    fetchUserData();
  }, [updateuser,user]);

  return (
    <UserContext.Provider value={{ user, setuser, setupdateuser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
