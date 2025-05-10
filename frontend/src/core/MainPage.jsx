import React, { useState } from 'react';
import ButtonNewAds from '../components/ButtonNewAds.jsx'
import { Outlet, Link } from 'react-router';

import {
  PieChartOutlined,
  TeamOutlined,
  SketchOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(<Link to={"/"}>Home</Link>, '1', <PieChartOutlined />),
  getItem(<Link to={"/ads"}>Ads</Link>, 'sub2', <TeamOutlined />,),
  getItem(<Link to={"/premium"}>Premium Ads</Link>, '2', <SketchOutlined />,),
];
const App = ({ avatar, isLogin, token, userEmail }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return isLogin ?
    <Layout
      style={{
        minHeight: '100vh',
      }}
      token={token}
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
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <ButtonNewAds />
          {avatar}
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
                title: `${userEmail}`,
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
  : <h1>Loadding</h1>;
};
export default App;
