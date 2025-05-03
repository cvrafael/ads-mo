import React, { useState } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';
const ButtonNewAds = () => {
  return (
    <>

      <Button type="primary" ><Link to="/newads"> New Ad? </Link></Button>
    </>
  );
};
export default ButtonNewAds;
