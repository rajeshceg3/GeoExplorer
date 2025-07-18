import React from 'react';
import './UserProfile.css';

const UserProfile = ({ userName, profilePicUrl, totalGamesPlayed, highestScore, onNavigateBack }) => {
  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <img src={profilePicUrl} alt={`${userName || 'User'}'s avatar`} className="profile-avatar" />
        <h2>{userName || "N/A"}</h2>
      </div>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-value">{totalGamesPlayed}</span>
          <span className="stat-label">Games Played</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{highestScore}</span>
          <span className="stat-label">Highest Score</span>
        </div>
      </div>
      <button onClick={onNavigateBack} className="primary-action-button">
        Back to Game
      </button>
    </div>
  );
};

export default UserProfile;
