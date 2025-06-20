import React from 'react';

const RoundInfoDisplay = ({ distance, roundScore, totalScore }) => {
  return (
    <div className="round-info"> {/* Optional: Add a class for styling from App.css or a new CSS file */}
      {distance !== null && <p>Distance: <span className="info-value">{distance.toFixed(2)}</span> km</p>}
      {/* roundScore is always displayed as per the plan, even if 0 before calculation in some edge cases */}
      <p>Round Score: <span className="score-value">{roundScore}</span></p>
      <p>Total Score: <span className="total-score-value">{totalScore}</span></p>
    </div>
  );
};

export default RoundInfoDisplay;
