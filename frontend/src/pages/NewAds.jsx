import React from 'react';
import { Button, Form, Input, Upload  } from 'antd';
import axios from 'axios';

const NewAds = ({idUser}) => {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const onFinish = async (values) => {
    const newArrayObject = {
      ...values.user, 
      'image': values.user.image.file.name,  
      'fk_id_user_entity': idUser,
      'file': values.user.image.file
    }
    console.log('newArrayObject' ,newArrayObject);
    try {
      await axios.post('http://localhost:3030/uploads', newArrayObject, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={['user', 'image']}
        label="Image Logo"
        rules={[
          {
            required: true,
          },
        ]}
      >
         <Upload
          beforeUpload={(file) => {
            return new Promise((resolve, reject)=>{
              if (file.size > 2) {
                reject('File size exceeded');
              } else {
                resolve('Success');
              }
            })
          }}
          accept='.jpg'
          maxCount={1}
         >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name={['user', 'title']}
        label="Title"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
          <Form.Item name={['user', 'description']} label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
};
  
export default NewAds;
