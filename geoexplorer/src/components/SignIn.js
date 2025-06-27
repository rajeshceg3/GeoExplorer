import React, { useEffect } from 'react';
// Removed useState and jwtDecode as they are no longer used here
import './SignIn.css';

const SignIn = ({
  isSignedIn,
  userName,
  profilePicUrl,
  handleSignOut,
  handleCredentialResponse, // Received from App.js
  // googleClientId is passed from App.js but used in the effect hook
}) => {
  // Effect to render the Google Sign-In button
  useEffect(() => {
    /* global google */
    // Initialization is now done in App.js
    // We only need to render the button here if it's not already rendered by App.js's logic
    // or if we want to ensure it uses the SignIn component's div.
    // The `handleCredentialResponse` is passed from App.js.
    if (!isSignedIn) { // Only render the button if the user is not signed in
      google.accounts.id.renderButton(
        document.getElementById("signInDiv"), // Ensure this div ID is consistent or passed as a prop
        { theme: "outline", size: "large" }
      );
    }
  }, [isSignedIn, handleCredentialResponse]); // Rerun if isSignedIn changes, to potentially hide/show button

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
        // This div is where the Google Sign-In button will be rendered.
        // Its visibility is controlled by App.js logic that hides/shows this based on isSignedIn state.
        <div id="signInDiv"></div>
      )}
    </div>
  );
};

export default SignIn;
