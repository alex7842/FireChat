import React,{useState,useEffect} from 'react'
import { Avatar,Modal } from 'antd'
import { db} from '@/config/firebase'
import { collection, getDocs, onSnapshot, query, where,Timestamp } from 'firebase/firestore'
import { StoryView } from './StoryView'
export const AllStories = () => {
    const [stories,setStories]=useState([])
    const [storyViewModal,setStoryViewModal]=useState(false);
    const [selectedStory,setSelectedStory]=useState(null);
    useEffect(() => {
        const fetchstories = async () => {
          const storyref = collection(db, 'stories');
          const storydata = await getDocs(storyref);
          
          const currentTime = Timestamp.now();
          
          const stories = storydata.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(story => {
              if (story.expiryTime.toDate() > currentTime.toDate()) {
                return true;
              } else {
                // Update the story document to mark it as expired
                updateDoc(doc(db, 'stories', story.id), {
                  expired: true
                });
                return false;
              }
            });
      
          setStories(stories);
          console.log(stories);
        }
      
        fetchstories();
      }, [])
      
  return (
    <>
    <Modal
  open={storyViewModal}
  onCancel={() => setStoryViewModal(false)}
  footer={null}
  width={600}
  centered
  className="story-view-modal"
>
    
  <StoryView selectedStory={selectedStory} onclose={setStoryViewModal} />
</Modal>
     {stories?.map((story,index) => (
        <div key={story.id} className="px-2">
          <div className="flex flex-col items-center justify-center">
           
            <button 
             onClick={() => {
                setSelectedStory(story);
                setStoryViewModal(true);
              }}
            className="block focus:outline-none">
              <div className="story-ring p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                <div className="bg-white p-[2px] rounded-full flex items-center justify-center">
                  <Avatar
                    size={48}
                    src={story.mediaUrl || '/default-avatar.png'}
                    alt={story.displayName}
                    className="story-avatar"
                  />
                </div>
              </div>
              <p className="text-white text-xs mt-2 truncate w-14 text-center">
                {story.displayName}
              </p>
            </button>

          </div>
        </div>
      ))}
    </>
  )
}
