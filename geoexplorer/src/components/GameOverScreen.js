import React from 'react';
import './GameOverScreen.css';
import DecryptedText from './DecryptedText';

const GameOverScreen = ({ totalScore, roundScores, onPlayAgain }) => {
  const getAgentRank = (score) => {
    if (score < 5000) return { title: "CIVILIAN", color: "#8e8e93" };
    if (score < 15000) return { title: "ANALYST", color: "#5ac8fa" };
    if (score < 24000) return { title: "FIELD AGENT", color: "#ffcc00" };
    return { title: "SPECIAL OPS", color: "#ff3b30" };
  };

  const rank = getAgentRank(totalScore);
  const fileNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <div className="game-summary fade-in-section">
      <div className="dossier-container">
        <div className="dossier-header">
          <span>CLASSIFIED DOC #{fileNumber}-X</span>
          <span>DATE: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="classified-stamp">TOP SECRET</div>

        <h2>MISSION DEBRIEF COMPLETE</h2>

        <div className="rank-display" style={{ borderColor: rank.color, boxShadow: `0 0 15px ${rank.color}40` }}>
          <p className="rank-label">AGENT RANK ASSIGNED</p>
          <h1 className="rank-title" style={{ color: rank.color }}>{rank.title}</h1>
        </div>

        <div className="final-score-container">
          <p className="final-score-label">FINAL CLEARANCE SCORE</p>
          <p className="final-score-value">
            <DecryptedText text={totalScore.toString()} speed={50} />
          </p>
        </div>

        <div className="round-scores-container">
          {roundScores.map((score, index) => (
            <div key={index} className="round-score-item">
              <span className="round-number">TARGET {index + 1}</span>
              <span className="round-score">{score}</span>
            </div>
          ))}
        </div>

        <div className="dossier-footer">
          <button onClick={onPlayAgain} className="primary-action-button">ACCEPT NEW MISSION</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
