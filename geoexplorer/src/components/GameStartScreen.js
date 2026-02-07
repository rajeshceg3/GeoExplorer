import React from 'react';
import './GameStartScreen.css';

const GameStartScreen = ({ onStartGame }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1>Welcome to GeoExplorer</h1>
        <p>Test your geography knowledge! Explore the world and guess where you are.</p>

        <div className="difficulty-selection">
          <h2>Select Difficulty</h2>
          <div className="difficulty-buttons">
            <button
              className="difficulty-btn easy"
              onClick={() => onStartGame('easy')}
            >
              Easy
              <span className="btn-desc">Famous landmarks</span>
            </button>
            <button
              className="difficulty-btn medium"
              onClick={() => onStartGame('medium')}
            >
              Medium
              <span className="btn-desc">Well-known places</span>
            </button>
            <button
              className="difficulty-btn hard"
              onClick={() => onStartGame('hard')}
            >
              Hard
              <span className="btn-desc">Challenging locations</span>
            </button>
            <button
              className="difficulty-btn all"
              onClick={() => onStartGame('all')}
            >
              All
              <span className="btn-desc">Mix of everything</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStartScreen;
