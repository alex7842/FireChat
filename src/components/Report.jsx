import React from 'react'
import { Button,Radio,Modal,message } from 'antd';
export const Report = () => {
  return (
    <Button 
    type="text" 
    block 
    onClick={() => {
      Modal.confirm({
        title: 'Report Post',
        content: (
          <Radio.Group className="flex flex-col space-y-2">
            <Radio value="irrelevant">Irrelevant Content</Radio>
            <Radio value="harmful">Harmful or Dangerous</Radio>
            <Radio value="adult">Adult/Sexual Content</Radio>
            <Radio value="spam">Spam or Misleading</Radio>
            <Radio value="hate">Hate Speech</Radio>
          </Radio.Group>
        ),
        okText: 'Submit Report',
        cancelText: 'Cancel',
        onOk: () => {
          message.success('Thank you for reporting. Our team will review this post.');
        }
      });
    }}
  >
    Report
  </Button>
  
  )
}
