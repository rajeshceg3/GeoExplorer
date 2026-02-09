import React from 'react';
import './RoundInfoDisplay.css';

const RoundInfoDisplay = ({ distance, roundScore, totalScore, locationName, currentRound, totalRounds, funFact, missionBrief, hintPenalty, streakBonus }) => {
  return (
    <div className="round-info">
      {locationName && (
        <h3 className="location-reveal">TARGET IDENTIFIED: {locationName}</h3>
      )}

      {missionBrief && (
        <div className="mission-brief-container">
          <h4>MISSION DEBRIEF:</h4>
          <p className="typewriter-text">{missionBrief}</p>
        </div>
      )}

      {funFact && (
        <div className="fun-fact-container">
          <h4>INTEL ACQUIRED:</h4>
          <p className="typewriter-text">{funFact}</p>
        </div>
      )}

      <div className="round-stats">
        <p>MISSION PROGRESS: {currentRound} / {totalRounds}</p>
        {distance !== null && (
          <p>TARGET DISTANCE: <span className="info-value">{distance.toFixed(2)} km</span></p>
        )}
        <div className="score-breakdown">
           {streakBonus > 0 && <p className="bonus-text">STREAK BONUS: +{streakBonus}</p>}
           {hintPenalty > 0 && <p className="penalty-text">HINT PENALTY: -{hintPenalty}</p>}
           <p>MISSION SCORE: <span className="score-value">{roundScore}</span></p>
        </div>
        <p>TOTAL CLEARANCE SCORE: <span className="total-score-value">{totalScore}</span></p>
      </div>
    </div>
  );
};

export default RoundInfoDisplay;
