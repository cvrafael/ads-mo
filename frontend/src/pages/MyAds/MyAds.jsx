import React, { useState, useEffect } from 'react';
import { EllipsisOutlined , SyncOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Tag, Form, Typography, Alert, Button, Popover, Space } from 'antd';
import { deletePost } from './apiMyAds';
import axios from 'axios';
const { Link } = Typography;

const { Meta } = Card;
const MyAds = ({ idUser }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [successAlert, setSuccessAlert] = useState(null);

     const contentToDelete = (id) => {
          const deleteMyPost = (id) => {
              deletePost(id)
              .then(()=> { 
                  setSuccessAlert(<Alert message="Deleted with Success" type="success" />)
              })
              .catch((error) => setSuccessAlert(<Alert message={error.msg} type="warning" />))
          }
          return (
              <Button style={{width: '100%'}} type='primary' onClick={()=>{deleteMyPost(id)}} danger>Delete</Button>
  
          )
      };

  useEffect(() => {
    async function getAllMyPosts(idUser) {
      await axios.get(`http://localhost:3030/post/${idUser}`)
        .then((result) => {
          setMyPosts(result.data);
        })
    }
    getAllMyPosts(idUser);
  }, [successAlert])

  return (
    <Flex gap={"middle"} vertical >
      {successAlert}
      {myPosts && myPosts.map((post) => {
        return (
          <Card
            key={post.id}
            cover={
              <img
                height={200}
                alt="example"
                src={`${import.meta.env.VITE_STATIC_FILES_STORAGE}${post.image}`}
              />
            }
            actions={[
                <Flex justify='center'>
                    <Popover content={contentToDelete(post.id)} title="Delete ad?" trigger="hover">
                        <EllipsisOutlined key="ellipsis" />
                    </Popover>

                </Flex>
            ]}
          >
            <Meta
              avatar={<Avatar src={`${import.meta.env.VITE_STATIC_FILES_STORAGE}${post.image}`} />}
              title={post.title}
              description={post.description}
            />

            <Flex justify='space-between' vertical>
              <div>
                <Form>

                  <Form.Item
                    name={['user', 'website']}
                    label="Website"
                  >
                    <Link href={`http://${post.website}`} target="_blank">
                      {post.website}
                    </Link>
                  </Form.Item>
                </Form>
                {post.payment_status == 'pending' ? 
                <Form> 
                  <Form.Item>
                  <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<ExclamationCircleOutlined />} color="warning">Pending</Tag>
                  </Form.Item>
                </Form> 
                : 
                post.payment_status == 'approved' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<SyncOutlined />} color="success">Premium</Tag>
                  </Form.Item>
                </Form>  
                : post.payment_status == 'rejected' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<CloseCircleOutlined />} color="error">Rejected</Tag>
                  </Form.Item>
                </Form> 
                :  post.payment_status == 'cancelled' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>
                  </Form.Item>
                </Form> 
                : ""
                }
              </div>
              <div>
                <Form>
                </Form>
                 {post.status == 'analysis' ? 
                <Form> 
                  <Form.Item>
                  <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<ExclamationCircleOutlined />} color="warning">In analysis</Tag>
                  </Form.Item>
                </Form> 
                : 
                post.status == 'approved' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<SyncOutlined />} color="success">Approved</Tag>
                  </Form.Item>
                </Form>  
                : post.status == 'repproved' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<CloseCircleOutlined />} color="error">Repproved</Tag>
                  </Form.Item>
                </Form> 
                : post.status == 'expired' ? 
                <Form> 
                  <Form.Item>
                    <Tag style={{ maxWidth: 90, maxHeight: 20 }}icon={<CloseCircleOutlined />} color="warning">Expired</Tag>
                  </Form.Item>
                </Form> 
                : ""
                }
              </div>
            </Flex>
          </Card>

        );
      })}
    </Flex >
  );
}
export default MyAds;
