import React from 'react'
import { Routes, Route } from "react-router";
import Main from "./core/MainPage.jsx";
import Ads from "./pages/Ads.jsx";
import MyAds from "./components/MyAds.jsx";
import Avatar from "./components/Avatar.jsx";
import Profile from "./pages/Profile.jsx";
import NewAds from "./pages/NewAds.jsx";
import useAuth from "./hooks/useAuth.jsx";

const App = () => {
    const [isLogin, token, idUser, userEmail, clients ] = useAuth();

  return (
    <Routes>
    <Route path="/" element={<Main avatar={<Avatar logout={clients} idUser={idUser} />} isLogin={isLogin} token={token} userEmail={userEmail}/>}>
    <Route path="/" element={<Ads idUser={idUser}/>} />
      <Route path="/ads" element={<Ads idUser={idUser} />} />
      <Route path="/myads" element={<MyAds idUser={idUser} />}/>
      <Route path="/profile" element={<Profile idUser={idUser} />} />
      <Route path="/newads" element={<NewAds idUser={idUser} />} />
    </Route>
    </Routes>
  )
}

export default App