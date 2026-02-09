import React from 'react';
import './GameOverScreen.css';

const GameOverScreen = ({ totalScore, roundScores, onPlayAgain }) => {
  const getAgentRank = (score) => {
    if (score < 5000) return { title: "CIVILIAN", color: "#8e8e93" };
    if (score < 15000) return { title: "ANALYST", color: "#5ac8fa" };
    if (score < 24000) return { title: "FIELD AGENT", color: "#ffcc00" };
    return { title: "SPECIAL OPS", color: "#ff3b30" };
  };

  const rank = getAgentRank(totalScore);

  return (
    <div className="game-summary fade-in-section">
      <h2>MISSION DEBRIEF COMPLETE</h2>

      <div className="rank-display" style={{ borderColor: rank.color }}>
        <p className="rank-label">AGENT RANK ASSIGNED</p>
        <h1 className="rank-title" style={{ color: rank.color }}>{rank.title}</h1>
      </div>

      <p className="final-score">FINAL CLEARANCE SCORE: {totalScore}</p>
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
