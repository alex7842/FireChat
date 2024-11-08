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
    <h1 className='mx-auto border-gray-300 bg-black rounded-lg text-6xl text-center text-white p-6 '>Video Call</h1>

    <Button  className='mt-4 bg-red-600 w-30 h-30 text-white text-1xl font-bold' onClick={()=>navigate("/ChatDm")} >Lobby</Button>
<div className='border-gray-300  '>
<VideoRoom/>
</div>
    </>
    
  )
}
