import { Button } from 'antd'
import React, { useContext } from 'react'
import GroupContext from './context/GroupContext'
import { VideoRoom } from './Videoroom';
import { useNavigate } from 'react-router-dom';
export const Videocall = () => {
  const {videocall,setvideocall}=useContext(GroupContext);
  const navigate=useNavigate();
  return (
    <>
    <h1 className='mx-auto border-gray-300 bg-black rounded-lg text-4xl text-center text-white p-2 '>Video Call</h1>

    <button 
  className='mt-4 px-4 py-2 bg-violet-500 text-white text-lg font-semibold rounded-full
             hover:bg-violet-600 transform hover:scale-105 transition-all duration-300
             shadow-lg hover:shadow-xl flex items-center gap-2'
  onClick={() => navigate("/ChatDm")}
>
  <span>Lobby</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
</button>

<div className='border-gray-300  '>
<VideoRoom/>
</div>
    </>
    
  )
}
