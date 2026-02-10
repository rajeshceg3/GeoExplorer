import React from 'react';
import './TacticalHUD.css';

const TacticalHUD = ({
  intelPoints,
  onActivateUplink,
  onActivateReport,
  isUplinkActive,
  isReportActive,
  gameMode,
  timeLeft
}) => {
  return (
    <div className="tactical-hud">
      <div className="hud-header">
        <span className="hud-title">G.I.M. - GEO INTEL MODULE</span>
        <span className="hud-status">ONLINE</span>
      </div>

      {gameMode === 'blitz' && (
        <div className={`hud-timer ${timeLeft <= 10 ? 'warning' : ''}`}>
          <span className="timer-label">TIME REMAINING</span>
          <span className="timer-value">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
        </div>
      )}

      <div className="hud-intel-points">
        <span className="ip-label">INTEL POINTS</span>
        <span className="ip-value">{intelPoints}</span>
      </div>

      <div className="hud-controls">
        <button
          className={`hud-button ${isUplinkActive ? 'active' : ''}`}
          onClick={onActivateUplink}
          disabled={isUplinkActive || intelPoints < 2}
          title="Satellite Uplink (Cost: 2 IP) - Highlights target region"
        >
          <div className="btn-content">
            <span className="btn-icon">🛰️</span>
            <span className="btn-text">SAT UPLINK</span>
            <span className="btn-cost">2 IP</span>
          </div>
          {isUplinkActive && <span className="active-indicator">ACTIVE</span>}
        </button>

        <button
          className={`hud-button ${isReportActive ? 'active' : ''}`}
          onClick={onActivateReport}
          disabled={isReportActive || intelPoints < 1}
          title="Field Report (Cost: 1 IP) - Decrypts local intel"
        >
          <div className="btn-content">
            <span className="btn-icon">📄</span>
            <span className="btn-text">FIELD REPORT</span>
            <span className="btn-cost">1 IP</span>
          </div>
          {isReportActive && <span className="active-indicator">REVEALED</span>}
        </button>
      </div>

      <div className="hud-footer">
        AWAITING COMMAND...
      </div>
    </div>
  );
};

export default TacticalHUD;
