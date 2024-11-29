import React, { useState,useContext } from 'react';
import { Hash, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import {message} from "antd"
import ChatContext from './context/ChatContext';
const PersonalizedFeed = ({setpersonal}) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const {homereload,sethomereload}=useContext(ChatContext)
  const topics = [
    { id: 'general', label: ' Uncategorized News', icon: '🎓' },
   
   
   
    { id: 'technology', label: 'Tech News', icon: '💻' },
   
    { id: 'health', label: 'Health & Fitness', icon: '💪' },
    
    { id: 'business', label: 'Business & Finance', icon: '💼' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'sports', label: 'Sports', icon: '🚀' },
    { id: 'science', label: 'Science', icon: '⚛️' },
  ];

  const handleTopicSelect = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
    } else if (selectedTopics.length < 2) {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length === 2) {
        // Combine topics with +
        const combinedTopics = selectedTopics.join(',');
        
        // Store in localStorage
        localStorage.setItem('userInterests', combinedTopics);
        
        // Show success message
        message.success("Feed updated successfully!");
        sethomereload(prev => prev + 1);  // I
        // Optional: Close the modal or redirect
        setpersonal(false);
    }
};

  return (
    <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Hash className="w-6 h-6" />
          Discover Your Interests
        </h2>
        <p className="text-violet-100">
          Select 2 topics to personalize your feed ({selectedTopics.length}/2)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic.id)}
            disabled={!selectedTopics.includes(topic.id) && selectedTopics.length >= 3}
            className={`
              flex items-center gap-2 p-3 rounded-lg transition-all duration-300
              ${selectedTopics.includes(topic.id)
                ? 'bg-white text-violet-600 shadow-lg scale-105'
                : 'bg-violet-400/20 text-white hover:bg-violet-400/30'}
              ${!selectedTopics.includes(topic.id) && selectedTopics.length >= 2
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'}
            `}
          >
            <span>{topic.icon}</span>
            <span className="font-medium">{topic.label}</span>
            {selectedTopics.includes(topic.id) && (
              <CheckCircle className="w-5 h-5 ml-auto text-violet-600" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedTopics.length !== 2}
        className={`
          flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg
          font-semibold transition-all duration-300
          ${selectedTopics.length === 2
            ? 'bg-white text-violet-600 hover:shadow-lg hover:scale-105'
            : 'bg-violet-400/20 text-violet-200 cursor-not-allowed'}
        `}
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PersonalizedFeed;
