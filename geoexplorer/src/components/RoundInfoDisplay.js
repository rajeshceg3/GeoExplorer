import React from 'react';

const RoundInfoDisplay = ({ distance, roundScore, totalScore, locationName, currentRound, totalRounds, funFact, hintPenalty, streakBonus }) => {
  return (
    <div className="round-info">
      {locationName && (
        <h3 className="location-reveal">📍 {locationName}</h3>
      )}

      {funFact && (
        <div className="fun-fact-container">
          <h4>💡 Did you know?</h4>
          <p>{funFact}</p>
        </div>
      )}

      <div className="round-stats">
        <p>Round {currentRound} of {totalRounds}</p>
        {distance !== null && (
          <p>Distance: <span className="info-value">{distance.toFixed(2)} km</span></p>
        )}
        <div className="score-breakdown">
           {streakBonus > 0 && <p className="bonus-text">Streak Bonus: +{streakBonus}</p>}
           {hintPenalty > 0 && <p className="penalty-text">Hint Penalty: -{hintPenalty}</p>}
           <p>Round Score: <span className="score-value">{roundScore}</span></p>
        </div>
        <p>Total Score: <span className="total-score-value">{totalScore}</span></p>
      </div>
    </div>
  );
};

export default RoundInfoDisplay;
