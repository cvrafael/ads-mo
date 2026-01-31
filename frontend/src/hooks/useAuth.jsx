// import { useState, useEffect, useRef } from "react";
// // import Keycloak from "keycloak-js";
import {jwt} from "jwt-decode";

// const client = new Keycloak({
//   url: import.meta.env.VITE_KEYCLOAK_URL,
//   realm: import.meta.env.VITE_KEYCLOAK_REALM,
//   clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
// });

// const useAuth = () => {
//   const isRun = useRef(false);
//   const [isLogin, setLogin] = useState(false);
//   const [clients, setClients] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
  
//   useEffect(() => {
//     if (isRun.current) return;
    
//     isRun.current = true;
//     client
//     .init({
//       onLoad: "login-required",
//       checkLoginIframe: true,
//       pkceMethod: 'S256',
//     })
//     .then((res) => {
//       setLogin(res);
//       setClients(client)
//       const roles = client.tokenParsed?.realm_access?.roles || [];
//       setIsAdmin(roles.includes('ads-mo-adm'));
//       });
//       console.log(isAdmin)
//   }, []);

//   return [isLogin, clients, isAdmin];
// };

// export default useAuth;