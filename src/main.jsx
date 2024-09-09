import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChatDm from './components/ChatDm.jsx'
import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home.jsx'
import { UserProvider } from './components/context/context.jsx'
import { ChatProvider } from './components/context/ChatContext.jsx'
import { GroupProvider } from './components/context/GroupContext.jsx'
import ProfilePage from './components/Profilepage.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  
    <UserProvider> 
      <GroupProvider>{/* Wrap the entire Router with UserProvider */}
      <ChatProvider> {/* Then wrap with ChatProvider */}
        <BrowserRouter>
          <Routes>
            <Route index element={<App />} />
            <Route path='/Home' element={<Home />} />
            <Route path='ChatDm' element={<ChatDm/>}/>
            <Route path='/App' element={<App />} />    
            <Route path='/ProfilePage' element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
      </GroupProvider>
    </UserProvider>
  
);
