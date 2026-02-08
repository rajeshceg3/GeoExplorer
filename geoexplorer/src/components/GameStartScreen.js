import React from 'react';
import './GameStartScreen.css';

const GameStartScreen = ({ onStartGame, onDailyChallenge }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>GEO-EXPLORER // MISSION SELECT</h1>
        <p className="tactical-text">AWAITING AGENT DEPLOYMENT... SELECT CLEARANCE LEVEL.</p>

        <div className="difficulty-selection">
          <div className="difficulty-buttons">
            <button
              className="difficulty-btn easy"
              onClick={() => onStartGame('easy')}
            >
              CLEARANCE LEVEL 1
              <span className="btn-desc">CADET (EASY)</span>
            </button>
            <button
              className="difficulty-btn medium"
              onClick={() => onStartGame('medium')}
            >
              CLEARANCE LEVEL 2
              <span className="btn-desc">AGENT (MEDIUM)</span>
            </button>
            <button
              className="difficulty-btn hard"
              onClick={() => onStartGame('hard')}
            >
              CLEARANCE LEVEL 3
              <span className="btn-desc">VETERAN (HARD)</span>
            </button>
            <button
              className="difficulty-btn all"
              onClick={() => onStartGame('all')}
            >
              BLACK OPS
              <span className="btn-desc">CLASSIFIED (ALL)</span>
            </button>
          </div>
          <div className="daily-challenge-container">
             <button
              className="difficulty-btn daily"
              onClick={onDailyChallenge}
            >
              DAILY OPERATION
              <span className="btn-desc">TARGET OF THE DAY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStartScreen;
