import React,{useState} from 'react'
import { Routes, Route } from "react-router";
import { GoogleOAuthProvider, useGoogleOneTapLogin } from "@react-oauth/google";
import GoogleLogin from './pages/Login/Login.jsx'
import {jwtDecode} from "jwt-decode";
import Main from "./core/MainPage.jsx";
import Ads from "./pages/Ads/Ads.jsx";
import MyAds from "./pages/MyAds/MyAds.jsx";
import Avatar from "./components/Avatar/Avatar.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NewAds from "./pages/NewAds/NewAds.jsx";
import NotExists from "./components/NotExists/NotExists.jsx";
import ButtonNewAds from './components/ButtonNewAds/ButtonNewAds.jsx'
// import useAuth from "./hooks/useAuth.jsx";
import PremiumAds from './pages/PremiumAds/PremiumAds.jsx';
import PixMercadoPago from './components/PixMercadoPago/PixMercadoPago.jsx';
import Administrator from './pages/Administrator/Administrator.jsx';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const App = () => {
    const [datas, setDatas] = useState(null);
    const [admin, setAdmin] = useState(null);

    const actions = {
    receiveDatas: (apiDatas) => setDatas(apiDatas),
    isAdmin: (apiAdmin) =>  setAdmin(apiAdmin),
  };

  return (
     <GoogleOAuthProvider clientId={clientId}>     
      <Routes>
        <Route path="/" element={<Main GoogleLogin={<GoogleLogin actions={actions} />} datas={datas} admin={admin?.is_admin} ButtonNewAds={<ButtonNewAds/>}/>
                                }>
        <Route path="/" element={<Ads idUser={datas?.id_sub} />} />
        <Route path="/ads" element={<Ads idUser={datas?.id_sub} />} />
        <Route path="/myads" element={<MyAds idUser={datas?.id_sub} />}/>
        <Route path="/profile" element={<Profile idUser={datas?.id_sub} />} />
        <Route path="/newads" element={<NewAds idUser={datas?.id_sub} userEmail={datas?.email} />} />
        <Route path="/premium" element={<PremiumAds idUser={datas?.id_sub} />} />
        <Route path="/admin" element={<Administrator idUser={datas?.id_sub} userEmail={datas?.email}  userFirstName={datas?.name}/>} />
        <Route path="/mercadopg" element={<PixMercadoPago userEmail={datas?.email}/>} />
          <Route path="/*" element={<NotExists />} />
        </Route>
      </Routes>
      </GoogleOAuthProvider>
    
  )
}

export default App