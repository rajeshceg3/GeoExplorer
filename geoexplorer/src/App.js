import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import './App.css';
import SignIn from './components/SignIn';
import StreetView from './components/StreetView'; // Ensure this is the default import
import MapContainer from './components/Map'; // Import the Map component
import { calculateDistance, calculateScore } from './utils/geometry';
import GameOverScreen from './components/GameOverScreen';
import RoundInfoDisplay from './components/RoundInfoDisplay';
import UserProfile from './components/UserProfile'; // Import UserProfile
import gameLocationsData from './locations.json';

// Define hardcoded locations
// const gameLocations = [
//   { lat: 48.8584, lng: 2.2945 }, // Eiffel Tower
//   { lat: 40.6892, lng: -74.0445 }, // Statue of Liberty
//   { lat: -33.8568, lng: 151.2153 }, // Sydney Opera House
//   { lat: 27.1751, lng: 78.0421 }, // Taj Mahal
//   { lat: 41.8902, lng: 12.4922 } // Colosseum
// ];

function App() {
  // Initialize state variables for user authentication
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');

  // State to manage current view ('game' or 'profile')
  const [currentView, setCurrentView] = useState('game');

  // Initialize state variables for game logic
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState('guessing'); // 'guessing', 'round_summary', 'game_over'
  const [locations, setLocations] = useState(gameLocationsData);
  const [playerGuess, setPlayerGuess] = useState(null); // { lat: ..., lng: ... }
  const [actualLocation, setActualLocation] = useState(null); // { lat: ..., lng: ... } for the current round
  const [distance, setDistance] = useState(null);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]); // Array to store scores of each round

  // State for user's lifetime statistics (session-based)
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [userHighestScore, setUserHighestScore] = useState(0);

  // Navigation functions
  const navigateToGame = () => setCurrentView('game');
  const navigateToProfile = () => setCurrentView('profile');

  // Google Sign-In initialization and user state handling
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual client ID
      callback: handleCredentialResponse,
    });
  }, []);

  // Handle credential response from Google Sign-In
  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    var decodedToken = jwt_decode(response.credential);
    setIsSignedIn(true);
    setUserName(decodedToken.name);
    setProfilePicUrl(decodedToken.picture);
    // Hide the sign-in button after successful sign-in
    const signInButton = document.getElementById("signInDiv");
    if (signInButton) {
      signInButton.hidden = true;
    }
  };

  // Handle sign-out
  const handleSignOut = (event) => {
    setIsSignedIn(false);
    setUserName('');
    setProfilePicUrl('');
    setCurrentView('game'); // Return to game view on sign out
    setTotalGamesPlayed(0); // Reset lifetime stats
    setUserHighestScore(0); // Reset lifetime stats
    // Show the sign-in button again
    const signInButton = document.getElementById("signInDiv");
    if (signInButton) {
      signInButton.hidden = false;
    }
  };

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
      // Update lifetime stats when a game finishes
      setTotalGamesPlayed(prevGamesPlayed => prevGamesPlayed + 1);
      if (totalScore > userHighestScore) {
        setUserHighestScore(totalScore);
      }
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
    setCurrentView('game'); // Ensure game view is active when playing again
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GeoExplorer</h1>
        <div className="header-controls">
          {isSignedIn && currentView === 'game' && (
            <button onClick={navigateToProfile} className="profile-button">
              View Profile
            </button>
          )}
          <SignIn
            isSignedIn={isSignedIn}
            userName={userName}
            profilePicUrl={profilePicUrl}
            handleSignOut={handleSignOut}
            handleCredentialResponse={handleCredentialResponse}
            googleClientId="YOUR_GOOGLE_CLIENT_ID"
          />
        </div>
      </header>

      {currentView === 'game' ? (
        <>
          {(gamePhase === 'guessing' || gamePhase === 'round_summary') && (
            <>
              <div className="container fade-in-section">
                <div className="street-view-container">
                  <StreetView actualLocation={actualLocation} />
                </div>
                <div className="map-container">
                  <MapContainer
                    playerGuess={playerGuess}
                    actualLocation={actualLocation}
                    handleMapClick={handleMapClick}
                    gamePhase={gamePhase}
                  />
                </div>
              </div>
              {gamePhase === 'guessing' && (
                <button
                  onClick={handleMakeGuess}
                  disabled={!playerGuess}
                  className="primary-action-button"
                >
                  Make Guess
                </button>
              )}
              {gamePhase === 'round_summary' && (
                <div className="round-summary-container fade-in-section">
                  <RoundInfoDisplay
                    distance={distance}
                    roundScore={roundScore}
                    totalScore={totalScore}
                  />
                  <button onClick={handleNextRound} className="primary-action-button">
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
        </>
      ) : (
        <UserProfile
          userName={userName}
          profilePicUrl={profilePicUrl}
          totalGamesPlayed={totalGamesPlayed}
          highestScore={userHighestScore}
          onNavigateBack={navigateToGame}
        />
      )}
    </div>
  );
}

export default App;
