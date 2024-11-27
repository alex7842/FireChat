import React,{useState,useEffect}from 'react'
import { Modal } from 'antd';
import { Story } from './Story';
import {PlusOutlined} from "@ant-design/icons";
export const StoryUpload = () => {
    const [storyUploadModal,setStoryUploadModal]=useState(false);
  return (
    <div className="px-2">
         <Modal
  open={storyUploadModal}
  onCancel={() => setStoryUploadModal(false)}
  footer={null}
  width={400}
  centered
  className="story-upload-modal"
>
<Story onclose={setStoryUploadModal}/>
</Modal>
    <div className="flex flex-col items-center justify-center">
      <button 
        onClick={() => setStoryUploadModal(true)} 
        className="block focus:outline-none"
      >
        <div className="story-ring p-[2px] rounded-full border-2 border-dashed border-violet-400 hover:border-violet-600 transition-colors">
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[2px] rounded-full">
            <div className="bg-white rounded-full w-[48px] h-[48px] flex items-center justify-center">
              <PlusOutlined className="text-xl text-violet-600" />
            </div>
          </div>
        </div>
        <p className="text-white text-xs mt-2 truncate w-14 text-center">
          Add Story
        </p>
      </button>
    </div>
  </div>
  )
}
