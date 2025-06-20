import React from 'react';
// Optional: import './GameOverScreen.css'; // if you create a CSS file

const GameOverScreen = ({ totalScore, roundScores, onPlayAgain }) => {
  return (
    <div className="game-summary fade-in-section"> {/* Styles for .game-summary and its children are in App.css */}
      <h2>Game Over!</h2>
      <p className="final-score">Your final score: {totalScore}</p>
      <h3>Round Scores:</h3>
      {roundScores.map((score, index) => (
        <p key={index} className="round-score-item">Round {index + 1}: {score} points</p>
      ))}
      <button onClick={onPlayAgain} className="primary-action-button">Play Again</button>
    </div>
  );
};

export default GameOverScreen;
