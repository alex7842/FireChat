import React,{useEffect, useState} from 'react'
import { Popover,Input,Button,Space } from 'antd'
import { WandSparkles } from 'lucide-react'
import {SendOutlined} from "@ant-design/icons"

import ai from '../hooks/ai'

export const Ai = ({text}) => {
    const [inputText, setInputText] = useState(text);
      
const { suggestions, loading, error, fetchSuggestions,setSuggestions,streamRephrase } = ai();
  // console.log(text ,"from ai")
   useEffect(()=>{
   setInputText(text)
   },[text])

   const rephrase=()=>{
    //ai acalling
   streamRephrase(`Repharse this words in more meaningful\n ${text}`,0.5,6);
   console.log(suggestions)
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
              <Button onClick={rephrase}>Rephrase</Button>
              <Button>Grammar</Button>
            </Space>
          </div>
        );
      };
  return (
   <>
    <Popover content={content} title="" trigger="click" >
    
    <WandSparkles style={{fontSize: 18, color: '#1677ff',cursor:"pointer"}} />
    </Popover>
   </>
  )
}
