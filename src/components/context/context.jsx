// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setuser] = useState(() => {
    // Get the user data from local storage if it exists
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save the user data to local storage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User saved to localStorage:', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setuser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
