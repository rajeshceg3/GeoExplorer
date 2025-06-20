import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import './SignIn.css';

const SignIn = () => {
  // TODO: Replace YOUR_GOOGLE_CLIENT_ID with an environment variable
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const decoded = jwtDecode(response.credential);
    console.log(decoded);
    setUserName(decoded.name);
    setProfilePicUrl(decoded.picture);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    /* global google */
    google.accounts.id.disableAutoSelect();
    setIsSignedIn(false);
    setUserName('');
    setProfilePicUrl('');
    // Ensure the button is re-rendered if it was hidden or changed
    // This might require re-running the effect that renders the button,
    // or ensuring the div is simply made visible again.
    // The current logic with `style={{ display: isSignedIn ? 'none' : 'block' }}`
    // for the button div should handle showing it again when isSignedIn becomes false.
  };

  return (
    <div className="signInContainer">
      {isSignedIn ? (
        <div className="userInfo">
          <img src={profilePicUrl} alt="Profile" className="profilePic" />
          <p className="userName">Welcome, {userName}!</p>
          <button onClick={handleSignOut} className="signOutButton">
            Sign Out
          </button>
        </div>
      ) : (
        <div id="googleSignInButton" style={{ display: isSignedIn ? 'none' : 'block' }}></div>
      )}
    </div>
  );
};

export default SignIn;
