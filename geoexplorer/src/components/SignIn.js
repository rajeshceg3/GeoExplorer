import React, { useState } from 'react';
import './SignIn.css';

const SignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');

  const handleSignIn = () => {
    // Placeholder for actual Google Sign-In logic
    setIsSignedIn(true);
    setUserName('Test User');
    setProfilePicUrl('https://via.placeholder.com/50'); // Placeholder image
  };

  const handleSignOut = () => {
    // Placeholder for actual Google Sign-Out logic
    setIsSignedIn(false);
    setUserName('');
    setProfilePicUrl('');
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
        <button onClick={handleSignIn} className="signInButton">
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default SignIn;
