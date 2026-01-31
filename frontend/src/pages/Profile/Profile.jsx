import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Avatar, Upload } from 'antd';
import { recoveryUser } from '../Login/apiNewLogin';
import { postProfileDatas, findAvatar } from './apiProfile';

const Profile = ({ idUser }) => {
  const [user, setUser] = useState([]);
  const [avatar, setAvatar] = useState([]);

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const onFinish = async (values) => {

    console.log(values)

    const newArrayObject = {
      'avatar': values.avatar.image.file,
      'image': values.avatar.image.file.name,
      'fk_id_user': idUser,
    }

    postProfileDatas(newArrayObject)
  };

  useEffect(() => {

    async function findOneUser() {

      await recoveryUser()
        .then(response => {

          setUser(response.data);

        });

    }

   
    findOneUser();
    async function findAvatar(id){
    
      await axios.get(`http://localhost:3030/user/avatar/${id}`)  
      .then((result) => {

      setAvatar(result.data[0]);

    })    
    
    };

  }, []);

  return (

    <Form
      {...layout}
      fields={[
        {
          name: ["first_name"],
          value: user?.name,
        },
        {
          name: ["last_name"],
          value: user?.family_name,
        },
        {
          name: ["email"],
          value: user?.email,
        }
      ]}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={['avatar', 'image']}
        label="Avatar"
        valuePropName="image"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Upload
          beforeUpload={(file) => {
            return new Promise((resolve, reject) => {
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
          <Avatar icon={<UserOutlined />} src={avatar ? `${import.meta.env.VITE_STATIC_FILES_STORAGE}/${avatar.image} ` : `${user?.picture}`} />
        </Upload>

      </Form.Item>
      <Form.Item
        name={['first_name']}
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name={['last_name']}
        label="Last Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name={['email']}
        label="Email"
        rules={[
          {
            type: 'email',
          },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form >
  );

}
export default Profile;
