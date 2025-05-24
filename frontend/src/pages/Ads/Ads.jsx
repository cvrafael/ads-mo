import React, { useState, useEffect, useRef } from 'react';
import { LikeOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Avatar, Card, Flex, Typography, Form, Tag, Image } from 'antd';
const { Link } = Typography;

const { Meta } = Card;
const Ads = ({ idUser }) => {
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
    <Flex gap={"large"} wrap >
      {posts && posts.map((posts) => {
        return (
          <Card
            key={posts.id}
            cover={
              <Image
                height={300}
                width={739}
                alt="example"
                src={posts ? `${import.meta.env.VITE_STATIC_FILES_STORAGE}${posts.image}` : `${import.meta.env.VITE_STATIC_FILES_STORAGE}mo.png`}
              />
            }
          >
            <Flex justify='space-between'>
              <div>
                <Meta
                  avatar={<Avatar src={posts ? `${import.meta.env.VITE_STATIC_FILES_STORAGE}${posts.image}` : `${import.meta.env.VITE_STATIC_FILES_STORAGE}mo.png`} />}
                  title={posts.title}
                  description={posts.description}
                />
                <Flex justify='space-between'>
                  <div style={{ margin: 0 }}>
                    <Form>

                      <Form.Item
                        name={['user', 'website']}
                        label="Website"
                      >
                        <Link href={`http://${posts.website}`} target="_blank">
                          {posts.website}
                        </Link>
                      </Form.Item>
                    </Form>
                    {posts.premium == true ? <Form> <Form.Item>
                      <Tag style={{ maxWidth: 90, maxHeight: 20 }} icon={<SyncOutlined spin />} color="success">Premium</Tag>
                    </Form.Item></Form> : ""}
                  </div>
                </Flex>
              </div>
              <Flex gap={20} vertical justify='space-between'>
                <Flex justify='end'>
                  <LikeOutlined style={{ cursor: 'pointer', fontSize: '30px', color: 'lightskyblue' }} onClick={() => { giveLike(posts, idUser) }} />
                  <p style={{ fontSize: '20px' }} >{posts.like}</p>
                </Flex>
              </Flex>

            </Flex>
          </Card>
        )
      })}

    </Flex >
  );
}
export default Ads;
