import React, { useState, useEffect } from 'react';
import './App.css';
import SignIn from './components/SignIn';
import StreetView from './components/StreetView'; // Ensure this is the default import
import MapContainer from './components/Map'; // Import the Map component
import { calculateDistance, calculateScore } from './utils/geometry';
import GameOverScreen from './components/GameOverScreen';
import RoundInfoDisplay from './components/RoundInfoDisplay';
import gameLocationsData from './locations.json';

// Define hardcoded locations
// const gameLocations = [
//   { lat: 48.8584, lng: 2.2945 },   // Eiffel Tower
//   { lat: 40.6892, lng: -74.0445 }, // Statue of Liberty
//   { lat: -33.8568, lng: 151.2153 },// Sydney Opera House
//   { lat: 27.1751, lng: 78.0421 },  // Taj Mahal
//   { lat: 41.8902, lng: 12.4922 }   // Colosseum
// ];

function App() {
  // Initialize state variables
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState('guessing'); // 'guessing', 'round_summary', 'game_over'
  const [locations, setLocations] = useState(gameLocationsData);
  const [playerGuess, setPlayerGuess] = useState(null); // { lat: ..., lng: ... }
  const [actualLocation, setActualLocation] = useState(null); // { lat: ..., lng: ... } for the current round
  const [distance, setDistance] = useState(null);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]); // Array to store scores of each round

  // Load round data effect
  useEffect(() => {
    if (locations && locations.length > 0 && currentRound >= 1 && currentRound <= locations.length) {
      setActualLocation(locations[currentRound - 1]);
    }
  }, [currentRound, locations]);

  // Define handleMapClick function
  const handleMapClick = (coordinates) => {
    if (gamePhase === 'guessing') {
      setPlayerGuess(coordinates);
    }
  };

  // Define handleMakeGuess function
  const handleMakeGuess = () => {
    if (playerGuess) { // Ensure a guess has been made
      setGamePhase('round_summary');
    }
  };

  // Calculate score and distance when gamePhase changes to 'round_summary'
  useEffect(() => {
    if (gamePhase === 'round_summary' && playerGuess && actualLocation) {
      const dist = calculateDistance(
        playerGuess.lat,
        playerGuess.lng,
        actualLocation.lat,
        actualLocation.lng
      );
      setDistance(dist);
      const score = calculateScore(dist);
      setRoundScore(score);
      setTotalScore(prevTotalScore => prevTotalScore + score);
      setRoundScores(prevRoundScores => [...prevRoundScores, score]);
    }
  }, [gamePhase, playerGuess, actualLocation]);

  // Advance to next round or end game
  const handleNextRound = () => {
    const nextRoundNumber = currentRound + 1;
    if (nextRoundNumber <= locations.length) {
      setCurrentRound(nextRoundNumber);
      setPlayerGuess(null);
      setDistance(null);
      setRoundScore(0);
      setGamePhase('guessing');
      // actualLocation will be updated by the useEffect hook watching currentRound
    } else {
      setGamePhase('game_over');
    }
  };

  // Reset game state to play again
  const handlePlayAgain = () => {
    setCurrentRound(1);
    setGamePhase('guessing');
    setPlayerGuess(null);
    // Explicitly set actualLocation to the first location for the new game.
    // Ensure 'locations' state is guaranteed to be populated here.
    // Given it's initialized with gameLocationsData and not changed, it should be safe.
    if (locations && locations.length > 0) {
      setActualLocation(locations[0]);
    } else {
      // Fallback or error if locations aren't loaded, though unlikely with current setup
      setActualLocation(null);
      console.error("handlePlayAgain: Locations array is empty or not loaded.");
    }
    setDistance(null);
    setRoundScore(0);
    setTotalScore(0);
    setRoundScores([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GeoExplorer</h1>
        <SignIn googleClientId="YOUR_GOOGLE_CLIENT_ID_HERE" />
      </header>

      {(gamePhase === 'guessing' || gamePhase === 'round_summary') && (
        <>
          <div className="container">
            <div className="street-view-container">
              <StreetView actualLocation={actualLocation} />
            </div>
            <div className="map-container">
              <MapContainer
                playerGuess={playerGuess}
                actualLocation={actualLocation}
                handleMapClick={handleMapClick} // Simplified: Map component now handles phase check internally
                gamePhase={gamePhase}
              />
            </div>
          </div>
          {gamePhase === 'guessing' && (
            <button
              onClick={handleMakeGuess}
              disabled={!playerGuess} // Button enabled once a guess is made on the map
            >
              Make Guess
            </button>
          )}
          {gamePhase === 'round_summary' && (
            <div className="round-summary-container"> {/* Changed class for clarity if needed */}
              <RoundInfoDisplay
                distance={distance}
                roundScore={roundScore}
                totalScore={totalScore}
              />
              <button onClick={handleNextRound}>
                {currentRound < locations.length ? 'Next Round' : 'Show Final Score'}
              </button>
            </div>
          )}
        </>
      )}

      {gamePhase === 'game_over' && (
        <GameOverScreen
          totalScore={totalScore}
          roundScores={roundScores}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
