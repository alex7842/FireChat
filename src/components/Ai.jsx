import React, { useEffect, useState } from 'react'
import { Popover, Input, Button, Space, Tooltip } from 'antd'
import { WandSparkles } from 'lucide-react'
import { SendOutlined } from "@ant-design/icons"
import ai from '../hooks/ai'

export const Ai = ({ text ,settext}) => {
  const [inputText, setInputText] = useState(text);

  const [rephraseLoading, setRephraseLoading] = useState(false);
const [grammarLoading, setGrammarLoading] = useState(false);

  const { suggestions, loading, error, fetchSuggestions, setSuggestions} = ai();

  useEffect(() => {
    setInputText(text)
  }, [text])
  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      setInputText(suggestions);
     
    }
  }, [suggestions]);
 
  
  


  const rephrase = () => {
    setSuggestions([]);
    setRephraseLoading(true);
   // setIsWriting(true);
    fetchSuggestions(`Rephrase the following text. Provide only the rephrased output without any additional comments or text:\n\n${inputText}`, 0.6, 40,"llama-v3p1-405b-instruct","chat")
    .finally(() => setRephraseLoading(false));
  
 
  }
  

  const grammer = () => {
    setSuggestions([]);
    setGrammarLoading(true);
    fetchSuggestions(`Correct any grammar mistakes in the following text. Provide only the corrected version without any additional comments or explanations:\n\n${inputText}`, 0.6, 40, "llama-v3p1-405b-instruct", "chat")
    .finally(() => setGrammarLoading(false));
   
  }
  
//loading error
const content = () => {
  const suggestions = [
    "How are you today?",
    "Have a wonderful day!",
    "Could you write a leave letter?",
    "Tell me about yourself"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-[350px] animate-fadeIn">
      {/* Suggestions Section */}
      <div className="mb-4">
        <h3 className="text-gray-600 mb-3 font-medium">Quick Suggestions</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => setInputText(suggestion)}
              className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full 
                         text-sm cursor-pointer hover:bg-violet-100 
                         transition-all duration-300 animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <Input.TextArea
        rows={4}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="border-2 border-gray-100 rounded-lg resize-none 
                   focus:border-violet-300 transition-all duration-300"
        placeholder="Type your message here..."
      />

      {/* Buttons Section */}
      <div className="flex gap-3 mt-4">
  <button
    onClick={() => settext(String(inputText))}
    className="flex items-center gap-2 px-3 py-2 bg-violet-500 text-white rounded-full
               hover:bg-violet-600 shadow-md hover:shadow-lg transition-all duration-300
               font-medium"
  >
    <SendOutlined className="text-sm" /> Insert
  </button>

  <button
    onClick={rephrase}
    disabled={rephraseLoading || grammarLoading}
    className="px-3 py-2 border-2 border-violet-500 text-violet-500 rounded-full
               hover:bg-violet-50 transition-all duration-300 font-medium
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {rephraseLoading ? (
      <span className="flex items-center gap-2">
        <span className="animate-spin">⟳</span> Analyzing...
      </span>
    ) : (
      "Rephrase"
    )}
  </button>

  <button
    onClick={grammer}
    disabled={rephraseLoading || grammarLoading}
    className="px-3 py-2 border-2 border-violet-500 text-violet-500 rounded-full
               hover:bg-violet-50 transition-all duration-300 font-medium
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {grammarLoading ? (
      <span className="flex items-center gap-2">
        <span className="animate-spin">⟳</span> Analyzing...
      </span>
    ) : (
      "Grammar"
    )}
  </button>
</div>

    </div>
  );
};


  return (
    <>
      <Popover content={content} title="" trigger="click" >
        <Tooltip title="AI" placement='top'><WandSparkles style={{ fontSize: 18, cursor: "pointer" }} className='text-violet-500' /></Tooltip>
      </Popover>
    </>
  )
}
