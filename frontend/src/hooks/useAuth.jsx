import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);
  const [idUser, setIduser] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [clients, setClients] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (isRun.current) return;
    
    isRun.current = true;
    client
    .init({
      onLoad: "login-required",
      checkLoginIframe: true,
      pkceMethod: 'S256',
    })
    .then((res) => {
      console.log('clients useAuth.jsx', client)
      setLogin(res);
      setToken(client.token);
      setIduser(client.tokenParsed.sub);
      setUserEmail(client.tokenParsed.email);
      setClients(client)
      const roles = client.tokenParsed?.realm_access?.roles || [];
      setIsAdmin(roles.includes('ads-mo-adm'));
      });
  }, []);

  return [isLogin, clients, isAdmin];
};

export default useAuth;