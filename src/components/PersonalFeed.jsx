import React, { useState } from 'react';

const PersonalizedFeed = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const topics = [
    { id: 'education', label: 'Education & Learning' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'history', label: 'History' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'microsoft', label: 'Microsoft' },
    { id: 'books', label: 'Books and Literature' },
    { id: 'health', label: 'Health & Fitness' },
    { id: 'music', label: 'Music' },
    { id: 'business', label: 'Business & Finance' },
    { id: 'movies', label: 'Movies' },
    { id: 'nasa', label: 'NASA' },
    { id: 'physics', label: 'Physics' },
  ];

  const handleTopicSelect = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSubmit = () => {
    // Implement logic to create personalized feed based on selected topics
    console.log('Selected topics:', selectedTopics);
  };

  return (
    <div
      style={{
        background: '#8B5CF6',
        padding: '2rem',
        borderRadius: '1rem',
        color: 'white',
      }}
    >
      <h2>Discover</h2>
      <p>Find channels to follow for a personalized feed.</p>
      <div style={{ marginBottom: '1rem' }}>
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic.id)}
            style={{
              backgroundColor: selectedTopics.includes(topic.id)
                ? '#A78BFA'
                : '#8B5CF6',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              margin: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {topic.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#C4B5FD',
          border: 'none',
          color: '#8B5CF6',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default PersonalizedFeed;