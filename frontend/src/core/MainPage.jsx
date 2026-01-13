import React, { useState } from 'react';
import ButtonNewAds from '../components/ButtonNewAds/ButtonNewAds.jsx'
import { Outlet, Link } from 'react-router';



import {
  PieChartOutlined,
  TeamOutlined,
  SketchOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Flex, Image } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

// const App = ({ avatar, isLogin, token, userEmail, isAdmin }) => {
const App = ({ GoogleLogin }) => {

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to={"/"}>Home</Link>, '100', <PieChartOutlined />),
  getItem(<Link to={"/ads"}>MuOnline</Link>, 'sub2', <TeamOutlined />,),
  getItem(<Link to={"/premium"}>MuOnline Premium</Link>, '200', <SketchOutlined />,),
  // isAdmin? getItem(<Link to={"/admin"}>Administrator</Link>, '300', <SketchOutlined />,): "",
];

  const [collapsed, setCollapsed] = useState(false);
  // const [oauthGoogle, setOauthGoogle] = useState([]);
  // console.log('datas',oauthGoogle)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
      // token={token}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            padding: 0,
            background: colorBgContainer,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          
          <h1>Sejam Todos Bem-vindos</h1>
          <Flex align='center' gap={5}>
            <ButtonNewAds />
          
          {/* {avatar} */}
          {GoogleLogin}
          
          </Flex>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={[
              {
                title: 'User',
              },
              {
                // title: `${userEmail}`,
                title: `${''}`,
              },              
            ]}
          >
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {<Outlet />}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  // : <Image   
  //     preview={false}
  //     width={150}
  //     alt="Blade Knight" 
  //     src={`${import.meta.env.VITE_STATIC_FILES_STORAGE}/bk02.gif`} />
  )
};
export default App;