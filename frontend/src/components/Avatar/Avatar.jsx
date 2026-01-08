import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {dotenv} from 'dotenv';
import { Link } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Flex, Popover } from 'antd';
const AvatarCard = ({ logout, idUser, userFirstName }) => {
  const [ avatar, setAvatar] = useState([])
  
  useEffect(()=>{
    async function findAvatar(idUser){
      await axios.get(`http://localhost:3030/user/avatar/${idUser}`)
      .then((result)=>{
        setAvatar(result.data[0]);
      });
    }
    findAvatar(idUser);
  }, []);

  const description = (logout) => {
    return (
      <Flex vertical>
        <Link to='/profile'>Profile</Link>
        <Link to='/myads'>Ads</Link>
        <a onClick={() => { logout() }}>logout</a>
      </Flex>
    );
  };

  return (
    <>
      <Popover
        placement="left"
        trigger="hover"
        title={`${userFirstName}`}
        content={description(logout)}
      >
        <Avatar
          src={avatar?`${import.meta.env.VITE_STATIC_FILES_STORAGE}/${avatar.image}`: `${import.meta.env.VITE_STATIC_FILES_STORAGE}/muonline.jpg`}
          size={50}
          style={{ cursor: 'pointer', margin: '5px' }}
          icon={<UserOutlined />}
        />

      </Popover>

    </>

  );

};
export default AvatarCard;
