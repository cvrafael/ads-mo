import React, { useState } from "react";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Flex, Popover } from 'antd';
import { Link } from 'react-router';
import { jwtDecode } from "jwt-decode";
import {getApiUserDatas,findOneUser} from './apiNewLogin'

const Login = () => {

  // State to store user profile information
  const [oauthGoogle, setOauthGoogle] = useState([]);
  const [ data, setData] = useState([])
    const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? jwtDecode(localStorage.getItem('loginData'))
      : null
  );
  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log("Login successful:", credentialResponse);

  //     // Decode the user's JWT token to extract profile information
  //     const decoded = jwtDecode(credentialResponse.credential);
  //     console.log("Decoded Token:", decoded);

  //     // Update the user profile state
  //     setUserProfile({
  //       name: decoded.name,
  //       email: decoded.email,
  //       picture: decoded.picture,
  //     });
  //   },
  //   onError: () => {
  //     console.log("Login failed");
  //   },
  //   use_fedcm_for_prompt: false, // Enable the browser to mediate the sign-in flow
  // });

    const handleLogin = async (googleData) => {
      const decoded = jwtDecode(googleData.credential);
      console.log('decoded', decoded)
    try {
      findOneUser(decoded.sub)
      
    } catch (error) {
      console.log('algo deu errado')
      getApiUserDatas(googleData)
      .then((res)=> {
        console.log('res', res.data)
        setLoginData(res.data);
      })
    }

    localStorage.setItem('loginData', googleData.credential);
  };

    const handleFailure = (result) => {
    alert(result);
  };

    const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  const description = () => {
    return (
      <Flex vertical>
        <Link to='/profile'>Profile</Link>
        <Link to='/myads'>Ads</Link>
        <a onClick={() => { handleLogout() }}>logout</a>
      </Flex>
    );
  };

  return (
    <>
      {loginData ? (
        <Popover
          placement="left"
          trigger="hover"
          title={`${loginData?loginData.name: null}`}
          content={description()}
        >
          <Avatar
            src={loginData?loginData.picture:null}
            size={50}
            style={{ cursor: 'pointer', margin: '5px' }}
            icon={<UserOutlined />}
          />

        </Popover>
      ) : (
        <GoogleLogin 
          onSuccess={handleLogin}
          cookiePolicy={'single_host_origin'}
        //     (credentialResponse) => {
        //   console.log(credentialResponse)
        //   console.log('datas', setOauthGoogle(jwtDecode(credentialResponse.credential)))
        // }}
          onError={() => handleFailure} />
      )}



    </>
  );
};

export default Login;