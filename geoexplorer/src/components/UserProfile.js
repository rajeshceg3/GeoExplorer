import React from 'react';
import './UserProfile.css';

const UserProfile = ({ userName, profilePicUrl, totalGamesPlayed, highestScore, onNavigateBack }) => {
  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        {profilePicUrl ? (
          <img src={profilePicUrl} alt={`${userName || 'User'}'s avatar`} className="profile-avatar" />
        ) : (
          <div className="default-avatar">No Avatar</div>
        )}
        <p className="user-name">Name: {userName || "N/A"}</p>
        <p className="user-stat-item">Total Games Played: {totalGamesPlayed}</p>
        <p className="user-stat-item">Highest Score: {highestScore}</p>
      </div>
      <button onClick={onNavigateBack} className="primary-action-button">
        Back to Game
      </button>
    </div>
  );
};

export default UserProfile;
