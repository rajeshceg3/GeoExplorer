import React from 'react';

const GameOverScreen = ({ totalScore, roundScores, onPlayAgain }) => {
  return (
    <div className="game-summary fade-in-section">
      <h2>Game Over</h2>
      <p className="final-score">Your final score: {totalScore}</p>
      <div className="round-scores-container">
        {roundScores.map((score, index) => (
          <div key={index} className="round-score-item">
            <span className="round-number">Round {index + 1}</span>
            <span className="round-score">{score}</span>
          </div>
        ))}
      </div>
      <button onClick={onPlayAgain} className="primary-action-button">Play Again</button>
    </div>
  );
};

export default GameOverScreen;
