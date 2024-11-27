import React from 'react';
import { Spin } from 'antd';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500/10 to-purple-500/10">
      <div className="animate-bounce space-y-4 text-center">
        <Spin size="large" className="text-violet-600" />
        <div className="text-violet-600 font-medium animate-pulse">
          Loading Profile...
        </div>
      </div>
    </div>
  );
};

export default Loader;
