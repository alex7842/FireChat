import React from 'react';
import { Popover, Button } from 'antd';
import { MoreVertical, Trash2, Settings, Flag } from 'lucide-react';

export const ChatOptions = ({ onDelete, onSettings, onReport }) => {
  const content = (
    <div className="flex flex-col gap-2">
      <Button 
        type="text" 
        className="flex items-center gap-2 hover:bg-gray-100"
        onClick={onDelete}
      >
        <Trash2 size={16} />
        Delete Chat
      </Button>
      <Button 
        type="text" 
        className="flex items-center gap-2 hover:bg-gray-100"
        onClick={onSettings}
      >
        <Settings size={16} />
        Chat Settings
      </Button>
      <Button 
        type="text" 
        className="flex items-center gap-2 hover:bg-gray-100"
        onClick={onReport}
      >
        <Flag size={16} />
        Report
      </Button>
    </div>
  );

  return (
    <Popover 
      content={content} 
      trigger="click"
      placement="bottomRight"
    >
      <MoreVertical className="cursor-pointer hover:text-blue-500 transition-colors" />
    </Popover>
  );
};
