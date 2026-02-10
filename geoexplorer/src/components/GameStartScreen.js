import React, { useState } from 'react';
import './GameStartScreen.css';
import TypewriterText from './TypewriterText';

const GameStartScreen = ({ onStartGame, onDailyChallenge }) => {
  const [isBlitzMode, setIsBlitzMode] = useState(false);

  const handleStart = (difficulty) => {
    onStartGame(difficulty, isBlitzMode ? 'blitz' : 'standard');
  };

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>GEO-EXPLORER // MISSION SELECT</h1>
        <div className="intro-text-wrapper" style={{ minHeight: '40px', marginBottom: '20px' }}>
          <TypewriterText text="AWAITING AGENT DEPLOYMENT... SELECT CLEARANCE LEVEL." speed={30} />
        </div>

        <div className="mode-selection">
          <label className={`blitz-toggle ${isBlitzMode ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={isBlitzMode}
              onChange={(e) => setIsBlitzMode(e.target.checked)}
            />
            <div className="toggle-content">
              <span className="toggle-title">
                {isBlitzMode ? '⚠️ BLITZ PROTOCOL ENGAGED' : 'BLITZ PROTOCOL OFFLINE'}
              </span>
              <span className="toggle-desc">
                {isBlitzMode ? 'WARNING: 60s TIME LIMIT PER ROUND' : 'ENABLE FOR TIME ATTACK MODE'}
              </span>
            </div>
          </label>
        </div>

        <div className="difficulty-selection">
          <div className="difficulty-buttons">
            <button
              className="difficulty-btn easy"
              onClick={() => handleStart('easy')}
            >
              CLEARANCE LEVEL 1
              <span className="btn-desc">CADET (EASY)</span>
            </button>
            <button
              className="difficulty-btn medium"
              onClick={() => handleStart('medium')}
            >
              CLEARANCE LEVEL 2
              <span className="btn-desc">AGENT (MEDIUM)</span>
            </button>
            <button
              className="difficulty-btn hard"
              onClick={() => handleStart('hard')}
            >
              CLEARANCE LEVEL 3
              <span className="btn-desc">VETERAN (HARD)</span>
            </button>
            <button
              className="difficulty-btn all"
              onClick={() => handleStart('all')}
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
