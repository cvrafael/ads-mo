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
      setLogin(res);
      setToken(client.token);
      setIduser(client.tokenParsed.sub);
      setUserEmail(client.tokenParsed.email);
      setClients(client)
      });
  }, []);

  return [isLogin, token, idUser, userEmail, clients];
};

export default useAuth;