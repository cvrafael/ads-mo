import React, { useState, useEffect } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex } from 'antd';
import axios from 'axios';

const { Meta } = Card;
const MyAds = ({idUser}) => {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(()=>{
    async function getAllMyPosts(idUser) {
      await axios.get(`http://localhost:3030/${idUser}`)
      .then((result) => {
        console.log(result.data);
        setMyPosts(result.data);
      })
    }
    getAllMyPosts(idUser);
  },[])


  return (
    <Flex gap={"middle"} vertical >
      {myPosts && myPosts.map((post) => {
        return (
          <Card
            key={post.id}
            cover={
              <img
                height={200}
                alt="example"
                src={`http://localhost:8181/uploads/${post.image}`}
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src={`http://localhost:8181/uploads/${post.image}`} />}
              title={post.title}
              description={post.description}
            />
          </Card>

        );
      })}
    </Flex >
  );
}
export default MyAds;
