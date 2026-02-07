import React, { useEffect } from 'react';
import './SignIn.css';

const SignIn = ({
  isSignedIn,
  userName,
  profilePicUrl,
  handleSignOut,
}) => {
  useEffect(() => {
    if (!isSignedIn && window.google) {
      /* global google */
      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [isSignedIn]);

  return (
    <div className="signInContainer">
      {isSignedIn ? (
        <div className="userInfo">
          <img src={profilePicUrl} alt="Profile" className="profilePic" />
          <button onClick={handleSignOut} className="signOutButton">
            Sign Out
          </button>
        </div>
      ) : (
        <div id="signInDiv"></div>
      )}
    </div>
  );
};

export default SignIn;
