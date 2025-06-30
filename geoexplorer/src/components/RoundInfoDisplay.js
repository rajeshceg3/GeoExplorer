import React from 'react';

const RoundInfoDisplay = ({ distance, roundScore, totalScore, locationName, currentRound, totalRounds }) => {
  return (
    <div className="round-info">
      {locationName && (
        <h3 className="location-reveal">📍 {locationName}</h3>
      )}
      <div className="round-stats">
        <p>Round {currentRound} of {totalRounds}</p>
        {distance !== null && (
          <p>Distance: <span className="info-value">{distance.toFixed(2)} km</span></p>
        )}
        <p>Round Score: <span className="score-value">{roundScore}</span></p>
        <p>Total Score: <span className="total-score-value">{totalScore}</span></p>
      </div>
    </div>
  );
};

export default RoundInfoDisplay;
