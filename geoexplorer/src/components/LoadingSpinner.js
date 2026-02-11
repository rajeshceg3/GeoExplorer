import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

const TACTICAL_MESSAGES = [
  "ESTABLISHING SECURE UPLINK...",
  "ENCRYPTING DATA STREAM...",
  "TRIANGULATING POSITION...",
  "DOWNLOADING SATELLITE IMAGERY...",
  "BYPASSING FIREWALLS...",
  "SYNCING INTEL DATABASE...",
  "CALIBRATING SENSORS..."
];

const LoadingSpinner = ({ message }) => {
  const [subMessage, setSubMessage] = useState(TACTICAL_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubMessage(TACTICAL_MESSAGES[Math.floor(Math.random() * TACTICAL_MESSAGES.length)]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-spinner-container">
      <div className="radar-spinner">
        <div className="radar-sweep"></div>
      </div>
      <div className="loading-text-container">
        {message && <p className="loading-message">{message}</p>}
        <p className="tactical-submessage">PROCESSING: {subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
