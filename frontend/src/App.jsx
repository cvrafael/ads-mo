import React,{useState} from 'react'
import { Routes, Route } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
import Main from "./core/MainPage.jsx";
import Ads from "./pages/Ads/Ads.jsx";
import MyAds from "./pages/MyAds/MyAds.jsx";
import Avatar from "./components/Avatar/Avatar.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NewAds from "./pages/NewAds/NewAds.jsx";
import NotExists from "./components/NotExists/NotExists.jsx";
// import useAuth from "./hooks/useAuth.jsx";
import PremiumAds from './pages/PremiumAds/PremiumAds.jsx';
import PixMercadoPago from './components/PixMercadoPago/PixMercadoPago.jsx';
import Administrator from './pages/Administrator/Administrator.jsx';

const App = () => {
  // const [isLogin, clients, isAdmin ] = useAuth();
  const [oauthGoogle, setOauthGoogle] = useState([]);
  console.log('datas',oauthGoogle)

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Main GoogleLogin={
                                                    <GoogleLogin 
                                                      onSuccess={(credentialResponse)=>{
                                                      console.log(credentialResponse)
                                                      console.log('datas',setOauthGoogle(jwtDecode(credentialResponse.credential)))
                                                    }}
                                                    onError={()=> console.log("Login Failed!")}
                                                    />} oauthGoogle={oauthGoogle.email_verified} />
                                }>
          {/* <Route path="/" element={<Ads />} />
        <Route path="/ads" element={<Ads  />} />
        <Route path="/myads" element={<MyAds idUser={clients?.tokenParsed?.sub} />}/>
        <Route path="/profile" element={<Profile idUser={clients?.tokenParsed?.sub} />} />
        <Route path="/newads" element={<NewAds idUser={clients?.tokenParsed?.sub} userEmail={clients?.tokenParsed?.email} />} />
        <Route path="/premium" element={<PremiumAds idUser={clients?.tokenParsed?.sub} />} />
        <Route path="/admin" element={<Administrator idUser={clients?.tokenParsed?.sub} userEmail={clients?.tokenParsed?.email}  userFirstName={clients?.tokenParsed?.name}/>} />
        <Route path="/mercadopg" element={<PixMercadoPago userEmail={clients?.tokenParsed?.email}/>} /> */}
          <Route path="/*" element={<NotExists />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App