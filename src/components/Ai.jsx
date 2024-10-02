import React, { useEffect, useState } from 'react'
import { Popover, Input, Button, Space } from 'antd'
import { WandSparkles } from 'lucide-react'
import { SendOutlined } from "@ant-design/icons"
import ai from '../hooks/ai'

export const Ai = ({ text }) => {
  const [inputText, setInputText] = useState(text);
  const [isWriting, setIsWriting] = useState(false);
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
   // setIsWriting(true);
    fetchSuggestions(`Rephrase the following text. Provide only the rephrased output without any additional comments or text:\n\n${inputText}`, 0.6, 40,"llama-v3p1-405b-instruct","chat");
 
  }
  

  const grammer = () => {
    setSuggestions([]);
    setIsWriting(true);
    fetchSuggestions(`Correct any grammar mistakes in the following text. Provide only the corrected version without any additional comments or explanations:\n\n${inputText}`, 0.6, 40, "llama-v3p1-405b-instruct", "chat");
    setIsWriting(false);
  }
  

  const content = () => {
    return (
      <div style={{ width: 300 }}>
        <Space wrap>
        </Space>
        <Input.TextArea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <Space>
          <Button type="primary" icon={<SendOutlined />}>
            Insert
          </Button>
          <Button onClick={rephrase} >{loading?"Analyzing...":"Rephrase"}</Button>
          <Button onClick={grammer} >{loading?"Analyzing...":"Grammer"}</Button>
        </Space>
      </div>
    );
  };

  return (
    <>
      <Popover content={content} title="" trigger="click" >
        <WandSparkles style={{ fontSize: 18, color: '#1677ff', cursor: "pointer" }} />
      </Popover>
    </>
  )
}
