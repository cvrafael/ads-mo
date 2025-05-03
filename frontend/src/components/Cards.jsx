import React, { useState, useEffect, useRef } from 'react';
import { LikeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Avatar, Card, Flex } from 'antd';

const { Meta } = Card;
const Cards = ({ idUser }) => {
  const [posts, setPosts] = useState([]);
  const LikeValue = useRef(); // Criar a referência

  async function getAllPosts() {
    await axios.get('http://localhost:3030/posts')
      .then((result) => {
        setPosts(result.data);
      });
  }

  async function countLikeUpdated(post, posts) {
    await axios.get(`http://localhost:3030/count/like/${post.id}`)
      .then((result) => {
        const newLike = posts.map((obj) => {
          if (obj.id === post.id) {
            return { ...obj, "like": result.data[0].like };
          }
          return obj;
        });
        setPosts(newLike);
      });
  }

  async function giveLike(post, iduser) {

    await axios.post('http://localhost:3030/user/like', {
      "fk_id_post": post.id,
      "fk_id_user_entity": iduser
    })
      .then((result) => {
        LikeValue.current = result.data[0].like;
      });

    if (LikeValue.current == 0) {
      const arrayTheObjects = { "like": 1, 'fk_id_user_entity': iduser, 'fk_id_post': post.id };
      await axios.post('http://localhost:3030/like', arrayTheObjects
      );
    } else if (LikeValue.current == 1) {
      const arrayTheObjects = { "like": 0, 'fk_id_user_entity': iduser, 'fk_id_post': post.id };
      await axios.post('http://localhost:3030/like', arrayTheObjects
      );
    }
    countLikeUpdated(post, posts);

  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <Flex gap={"middle"} vertical >
      {posts && posts.map((posts) => {
        return (
          <Card
            key={posts.id}
            cover={
              <img
                height={200}
                alt="example"
                src={`http://localhost:8181/uploads/${posts.image}`}
              />
            }
          >
            <Flex justify='space-between'>
              <Meta
                avatar={<Avatar src={`http://localhost:8181/uploads/${posts.image}`} />}
                title={posts.title}
                description={posts.description}
              />
              <Flex gap={5}>
                <LikeOutlined style={{ cursor: 'pointer', fontSize: '30px', color: 'lightskyblue' }} onClick={() => { giveLike(posts, idUser) }} />
                <p style={{ fontSize: '20px' }} >{posts.like}</p>
              </Flex>

            </Flex>
          </Card>
        )
      })}

    </Flex >
  );
}
export default Cards;
