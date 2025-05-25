import React, { useState, useEffect, useRef } from 'react';
import { SyncOutlined, SettingOutlined, EditOutlined } from '@ant-design/icons';
import {EmailValidated, EmailValidatedRepproved} from '../../components/Email/email';
import axios from 'axios';
import { Avatar, Card, Flex, Typography, Form, Tag, Popover, Button, Space, Upload, Input, Alert } from 'antd';
import { validationTheNewPost, updatePost } from './apiAdministrator';
const { Link } = Typography;

const { Meta } = Card;

const Administrator = ({ userFirstName, userEmail }) => {
    const [posts, setPosts] = useState([]);
    const [form] = Form.useForm();
    const monitClick = useRef();
    const [successAlert, setSuccessAlert] = useState('');

    const contentToVerify = (post) => {
        const datasPost = {...post, userName:userFirstName, userEmail: userEmail};
        const ApproveAd = () => {
            validationTheNewPost(post.id, 'approved')
            .then(()=> { 
                setSuccessAlert(<Alert message="Success Text" type="success" />)
                EmailValidated(datasPost);
            })
            .catch((error) => setSuccessAlert(<Alert message={error.msg} type="warning" />))
        }
        const RepproveAd = () => {
            validationTheNewPost(post.id, 'repproved')
            .then(()=> { 
                setSuccessAlert(<Alert message='Repproved' type="warning" />)
                EmailValidatedRepproved(datasPost);
            })
            .catch((error) => setSuccessAlert(<Alert message={error.msg} type="warning" />))
        }
        return (
        <Space>
            <Button type='primary' onClick={()=>{ApproveAd()}} ref={monitClick} >Approve</Button>
            <Button onClick={() => {RepproveAd()}} ref={monitClick}>Repprove</Button>
        </Space>

        )
    };

    const onFinish = async (values) => {
        console.log(values)
        try {
            await updatePost(posts[0].id, values.title, values.description, values.website)
            .then((result)=> {console.log(result.statusText)})

        } catch (error) {
            console.error("Erro durante o processamento:", error);
        }
    };

    const contentToEdit = (title, website, description ) => {
        return (

            <Flex vertical  >
                <Form
                    name="nest-messages"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                    fields={[
                    {
                        name: ["title"],
                        value: title,
                    },
                    {
                        name: ["description"],
                        value: description,
                    },
                    {
                        name: ["website"],
                        value: website,
                    }
                    ]}
                >
                    <Form.Item>
                    </Form.Item>
                    <Form.Item
                        name={['image']}
                        label="Image Logo"
                        valuePropName="image"
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
                            accept='.jpg, .gif'
                            maxCount={1}
                        >
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name={['title']}
                        label="Title"
                    >
                        <Input 
                        style={{
                            width: 300,
                        }} />
                    </Form.Item>
                    <Form.Item
                        name={['website']}
                        label="Website"
                    >
                        <Input style={{
                            width: 300,
                        }} />
                    </Form.Item>
                    <Form.Item
                        name={['description']}
                        label="Description"
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
        </Flex>
    );
};

    async function getAllPosts() {
        await axios.get('http://localhost:3030/posts-admin')
            .then((result) => {
                const resultStatusText = {...result, statusText: 'Dont have posts in the moment...'};
                setPosts(result.data);
                setSuccessAlert(<Alert message={resultStatusText.statusText} type="success" />)
            })
    }

    useEffect(() => {
        getAllPosts();
    }, [monitClick.current]);

    return (
        <Flex gap={"middle"} vertical >
            {posts.length == 0 ? successAlert: ""}
            {posts && posts.map((post) => {
                return (
                    <Card
                        key={post.id}
                        cover={
                            <img
                                height={300}
                                alt="example"
                                src={post ? `${import.meta.env.VITE_STATIC_FILES_STORAGE}${post.image}` : `${import.meta.env.VITE_STATIC_FILES_STORAGE}mo.png`}
                            />
                        }
                        actions={[

                            <Flex justify='space-around'>
                                <Popover content={contentToVerify(post)} title="Ads Verification" trigger="hover">
                                    <SettingOutlined key="setting" />
                                </Popover>
                                <Popover content={contentToEdit(post.title, post.website, post.description)} trigger="hover">
                                    <EditOutlined key="edit" />
                                </Popover>
                            </Flex>
                        ]}
                    >
                                <Meta
                                    avatar={<Avatar src={post ? `${import.meta.env.VITE_STATIC_FILES_STORAGE}${post.image}` : `${import.meta.env.VITE_STATIC_FILES_STORAGE}mo.png`} />}
                                    title={post.title}
                                    description={post.description}
                                />
                                <Flex justify='space-between' vertical>
                                    <div >
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
                                        {post.premium == true ?
                                        <Form>
                                             <Form.Item>
                                               <Tag style={{ maxWidth: 90, maxHeight: 20 }} icon={<SyncOutlined spin />} color="success">Premium</Tag>
                                             </Form.Item>
                                        </Form> : ""}
                                    </div>
                                    <div>
                                        {post.status == 'analysis' ?
                                        <Form>
                                             <Form.Item>
                                               <Tag style={{ maxWidth: 90, maxHeight: 20 }} icon={<SyncOutlined spin />} color="warning">Analysis</Tag>
                                             </Form.Item>
                                        </Form> : 
                                        post.status == 'repproved' ? <Tag style={{ maxWidth: 90, maxHeight: 20 }} icon={<SyncOutlined spin />} color="error">Repproved</Tag>:""}
                                    </div>
                                </Flex>
                    </Card>
                )
            })}

        </Flex >
    );
}
export default Administrator;
