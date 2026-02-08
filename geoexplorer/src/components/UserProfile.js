import React from 'react';
import './UserProfile.css';

const UserProfile = ({ userName, profilePicUrl, totalGamesPlayed, highestScore, onNavigateBack }) => {

  const getRank = (score) => {
    if (score < 5000) return 'ROOKIE';
    if (score < 15000) return 'FIELD AGENT';
    if (score < 24000) return 'SPECIAL OPERATIVE';
    return 'ELITE';
  };

  const rank = getRank(highestScore);

  return (
    <div className="user-profile-wrapper">
      <div className="user-profile-container">
        <div className="id-header">
          <span className="agency-name">GEO-INTEL AGENCY</span>
          <span className="clearance-level">CLEARANCE: {rank === 'ELITE' ? 'TOP SECRET' : 'RESTRICTED'}</span>
        </div>

        <div className="profile-content">
          <div className="profile-photo-section">
            <img src={profilePicUrl} alt={`${userName || 'User'}'s avatar`} className="profile-avatar" />
            <div className="rank-badge">{rank}</div>
          </div>

          <div className="profile-details">
            <h2 className="agent-name">AGENT: {userName ? userName.toUpperCase() : "UNKNOWN"}</h2>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">MISSIONS LOGGED</span>
                <span className="stat-value">{totalGamesPlayed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">MAX CLEARANCE</span>
                <span className="stat-value">{highestScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="id-footer">
          <span className="id-code">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          <button onClick={onNavigateBack} className="primary-action-button back-btn">
            RETURN TO HQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
