import React from 'react';

const RoundInfoDisplay = ({ distance, roundScore, totalScore }) => {
  return (
    <div className="round-info"> {/* Optional: Add a class for styling from App.css or a new CSS file */}
      {distance !== null && <p>Distance: {distance.toFixed(2)} km</p>}
      {/* roundScore is always displayed as per the plan, even if 0 before calculation in some edge cases */}
      <p>Score for this round: {roundScore}</p>
      <p>Total Score: {totalScore}</p>
    </div>
  );
};

export default RoundInfoDisplay;
