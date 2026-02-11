import React, { useState, useEffect } from 'react';
import './DecryptedText.css';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const DecryptedText = ({ text, speed = 50, reveal = true }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;

    if (!reveal) {
      setDisplayText(text.split('').map(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]).join(''));
      return;
    }

    const interval = setInterval(() => {
      setDisplayText(text
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return text[index];
          }
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        })
        .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, reveal]);

  return <span className="decrypted-text">{displayText}</span>;
};

export default DecryptedText;
