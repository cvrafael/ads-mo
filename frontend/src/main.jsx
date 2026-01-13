import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from "react-router";
import App from './App.jsx';
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);

