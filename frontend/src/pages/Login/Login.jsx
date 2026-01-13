import React, { useState } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {

  // State to store user profile information
  const [userProfile, setUserProfile] = useState(null);

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log("Login successful:", credentialResponse);

      // Decode the user's JWT token to extract profile information
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token:", decoded);

      // Update the user profile state
      setUserProfile({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
    },
    onError: () => {
      console.log("Login failed");
    },
    use_fedcm_for_prompt: false, // Enable the browser to mediate the sign-in flow
  });

  return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Google One Tap Login Example</h1>
        {userProfile ? (
          // Display user profile information after login
          <div style={{ marginTop: "20px" }}>
            <img
              src={userProfile.picture}
              alt="Profile"
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
            />
            <p>Email: {userProfile.email}</p>
          </div>
        ) : (
          <p>The browser mediates the sign-in flow seamlessly using FedCM.</p>
        )}
      </div>
  );
};

export default Login;