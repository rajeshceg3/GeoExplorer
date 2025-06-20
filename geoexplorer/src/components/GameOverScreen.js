import React from 'react';
// Optional: import './GameOverScreen.css'; // if you create a CSS file

const GameOverScreen = ({ totalScore, roundScores, onPlayAgain }) => {
  return (
    <div className="game-summary"> {/* Optional: Add a class for styling from App.css or a new CSS file */}
      <h2>Game Over!</h2>
      <p>Your final score: {totalScore}</p>
      <h3>Round Scores:</h3>
      {roundScores.map((score, index) => (
        <p key={index}>Round {index + 1}: {score} points</p>
      ))}
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};

export default GameOverScreen;
