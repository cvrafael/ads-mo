import React, { useState } from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { Avatar, Flex, Popover } from 'antd';
import { Link } from 'react-router';
import { jwtDecode } from "jwt-decode";
import {getApiUserDatas, isAdmin,recoveryUser,logout} from './apiNewLogin'
import { useEffect } from "react";

const Login = ({ actions }) => {

    const [user, setUser] = useState([]); 
    const navigate = useNavigate()

    const handleLogin = async (googleData) => {

      getApiUserDatas(googleData)
      .then((res)=> {
        isAdmin(res.data[0].id_sub)
        .then((res)=> {
          actions.isAdmin(res.data[0])
        })
        recoveryUser()
        .then(res => {
          setUser(res.data)
          actions.receiveDatas(res.data);
          }
        )
      })
  };

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogout = () => {
    logout();
    setUser([])
    actions.isAdmin({ is_admin: false})
    actions.receiveDatas(false);
    navigate('/')
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

  const recoverUser = async () => {

    return await recoveryUser()
    .then(res => {
      setUser(res.data)
      actions.receiveDatas(res.data);
      isAdmin(res.data.id_sub)
        .then((res)=> {
          actions.isAdmin(res.data[0])
        })
    }
  ).catch(function (error) {
            if (error.response.status === 401) {
                return console.log( error.response.data )
            } else if (error.request) {
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        })
}
useEffect(() => {
  recoverUser()
}, [])

  return (
    <>
      {user.length !== 0 ? (
        <Popover
          placement="left"
          trigger="hover"
          title={`${user?.name}`}
          content={description()}
        >
          <Avatar
            src={`${user?.picture}`}
            // size={50}
            style={{ cursor: 'pointer', margin: '5px' }}
          />

        </Popover>
      ) : (
        <GoogleLogin 
          onSuccess={handleLogin}
          cookiePolicy={'single_host_origin'}
          onError={() => handleFailure} />
      )}
    </>
  );
};

export default Login;