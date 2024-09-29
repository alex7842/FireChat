import { Input } from 'antd';
import React, { useRef } from 'react';

const { Search } = Input;

export const CustomInput = ({ value, onChange, onSearch, suggestion, onKeyDown,suffix}) => {


  
  const inputRef = useRef(null);
 
  const suggestionsString = Array.isArray(suggestion) 
    ? suggestion.join(' ').replace(/"/g, '')
    : suggestion || '';
  const newWords = suggestionsString.slice(value.length).trim();
  return (
    <div className="relative w-full">
      <Search
        ref={inputRef}
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        onKeyDown={onKeyDown}
        suffix={suffix}
        placeholder="Type here"
        enterButton="Send"
        className="w-full border border-black"
        size="large"
      />
      {suggestion && onChange && (
        <div
          className="absolute inset-0 pointer-events-none flex items-center px-3 text-sm text-gray-400"
        >
          <span className="invisible">{value+"  "}</span>
          <span className='ml-2'>{" "+newWords}</span>
        </div>
      )}
    </div>
  );
}
