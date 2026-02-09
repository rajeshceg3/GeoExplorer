import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import './App.css';
import SignIn from './components/SignIn';
import StreetView from './components/StreetView'; // Ensure this is the default import
import MapContainer from './components/Map'; // Import the Map component
import LoadingSpinner from './components/LoadingSpinner';
import { calculateDistance, calculateScore, getRandomPointInRadius } from './utils/geometry';
import { SeededRandom, shuffleArray } from './utils/random';
import GameOverScreen from './components/GameOverScreen';
import RoundInfoDisplay from './components/RoundInfoDisplay';
import UserProfile from './components/UserProfile'; // Import UserProfile
import GameStartScreen from './components/GameStartScreen';
import TacticalHUD from './components/TacticalHUD';
import ScanlineOverlay from './components/ScanlineOverlay';
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
  const [gamePhase, setGamePhase] = useState('start'); // 'start', 'guessing', 'round_summary', 'game_over'
  const [gameDifficulty, setGameDifficulty] = useState('all');
  const [locations, setLocations] = useState([]);
  const [playerGuess, setPlayerGuess] = useState(null); // { lat: ..., lng: ... }
  const [actualLocation, setActualLocation] = useState(null); // { lat: ..., lng: ... } for the current round
  const [distance, setDistance] = useState(null);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]); // Array to store scores of each round
  const [hintRevealed, setHintRevealed] = useState(false);
  const hintPenalty = 500;
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Intel Ops State
  const [intelPoints, setIntelPoints] = useState(3);
  const [activeIntel, setActiveIntel] = useState({ uplink: null });
  const [hintSource, setHintSource] = useState('none'); // 'none', 'penalty', 'intel'

  // State for user's lifetime statistics (session-based)
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [userHighestScore, setUserHighestScore] = useState(0);

  // Navigation functions
  const navigateToGame = () => setCurrentView('game');
  const navigateToProfile = () => setCurrentView('profile');

  // Function to randomly select locations for a new game
  const selectRandomLocations = (count = 5, difficulty = 'all') => {
    let filtered = gameLocationsData;
    if (difficulty !== 'all') {
      filtered = gameLocationsData.filter(loc => loc.difficulty === difficulty);
    }

    // If fewer locations than count (e.g. hard only has 3), just use all of them
    // Or if 0 found, fallback to all
    if (filtered.length === 0) {
      filtered = gameLocationsData;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleStartGame = (difficulty) => {
    setGameDifficulty(difficulty);
    const selectedLocations = selectRandomLocations(5, difficulty);
    setLocations(selectedLocations);
    setGamePhase('guessing');
    setCurrentRound(1);
    setPlayerGuess(null);
    setActualLocation(null);
    setDistance(null);
    setRoundScore(0);
    setTotalScore(0);
    setRoundScores([]);
    setHintRevealed(false);
    setHintSource('none');
    setActiveIntel({ uplink: null });
    setIntelPoints(3); // Reset IP for new game
    setCurrentStreak(0);
  };

  const handleDailyChallenge = () => {
    const today = new Date().toDateString();
    const rng = new SeededRandom(today);

    // Shuffle all locations with the seeded RNG
    const dailyLocations = shuffleArray(gameLocationsData, rng).slice(0, 5);

    setGameDifficulty('daily');
    setLocations(dailyLocations);
    setGamePhase('guessing');
    setCurrentRound(1);
    setPlayerGuess(null);
    setActualLocation(null);
    setDistance(null);
    setRoundScore(0);
    setTotalScore(0);
    setRoundScores([]);
    setHintRevealed(false);
    setHintSource('none');
    setActiveIntel({ uplink: null });
    setIntelPoints(3);
    setCurrentStreak(0);
  };

  // Google Sign-In initialization and user state handling
  useEffect(() => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google) {
      /* global google */
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });
    } else if (!googleClientId) {
      console.warn("Google Client ID is missing. Sign-in functionality will be disabled.");
    }
  }, []);

  // Handle credential response from Google Sign-In
  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    var decodedToken = jwtDecode(response.credential);
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

  const handleRevealHint = () => {
    setHintRevealed(true);
    setHintSource('penalty');
  };

  const handleActivateUplink = () => {
    if (intelPoints >= 2 && actualLocation) {
      setIntelPoints(prev => prev - 2);
      // Generate a random center such that actualLocation is within 3000km radius
      // We use getRandomPointInRadius(actualLocation, 2000) to get a center.
      // If we draw a 3000km circle around that center, actualLocation is guaranteed to be inside
      // because distance(center, actual) <= 2000 < 3000.
      const center = getRandomPointInRadius(actualLocation.lat, actualLocation.lng, 2000);
      setActiveIntel(prev => ({
        ...prev,
        uplink: {
          center: center,
          radius: 3000 // km
        }
      }));
    }
  };

  const handleActivateReport = () => {
    if (intelPoints >= 1 && !hintRevealed) {
      setIntelPoints(prev => prev - 1);
      setHintRevealed(true);
      setHintSource('intel');
    }
  };

  // Define handleMakeGuess function
  const handleMakeGuess = () => {
    if (playerGuess && !isCalculating) { // Ensure a guess has been made
      setIsCalculating(true);

      setTimeout(() => {
        const dist = calculateDistance(
          playerGuess.lat,
          playerGuess.lng,
          actualLocation.lat,
          actualLocation.lng
        );
        setDistance(dist);

        let score = calculateScore(dist);
        if (hintRevealed && hintSource === 'penalty') {
          score = Math.max(0, score - hintPenalty);
        }

        // Streak logic
        let newStreak = currentStreak;
        if (dist < 1000) {
          newStreak += 1;
          score += newStreak * 100;
          // Bonus IP for streak
          if (newStreak % 3 === 0) {
               setIntelPoints(prev => prev + 1);
          }
        } else {
          newStreak = 0;
        }
        setCurrentStreak(newStreak);

        setRoundScore(score);
        setTotalScore(prevTotalScore => prevTotalScore + score);
        setRoundScores(prevRoundScores => [...prevRoundScores, score]);
        setGamePhase('round_summary');
        setIsCalculating(false);
      }, 1500);
    }
  };

  // Advance to next round or end game
  const handleNextRound = () => {
    const nextRoundNumber = currentRound + 1;
    if (nextRoundNumber <= locations.length) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentRound(nextRoundNumber);
        setPlayerGuess(null);
        setDistance(null);
        setRoundScore(0);
        setHintRevealed(false);
        setHintSource('none');
        setActiveIntel({ uplink: null });
        setGamePhase('guessing');
        setIsLoading(false);
      }, 1500);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView === 'game') {
        if (e.key === 'Enter' && gamePhase === 'guessing' && playerGuess && !isCalculating) {
          handleMakeGuess();
        } else if ((e.key === ' ' || e.key === 'Enter') && gamePhase === 'round_summary') {
          handleNextRound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, gamePhase, playerGuess, isCalculating, handleNextRound]); // handleMakeGuess included via closure but handleNextRound needs to be dependency or useCallback

  // Reset game state to play again
  const handlePlayAgain = () => {
    setGamePhase('start');
    setCurrentView('game');
  };

  return (
    <div className="App">
      <ScanlineOverlay />
      <header className="App-header">
        <div className="header-left">
          <h1>GEO-EXPLORER // SYSTEM ONLINE</h1>
          {currentView === 'game' && currentStreak > 0 && (
            <div className="streak-badge" title="Consecutive guesses < 1000km">
              🔥 Streak: {currentStreak}
            </div>
          )}
        </div>
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
            googleClientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          />
        </div>
      </header>

      {currentView === 'game' ? (
        <>
          {gamePhase === 'start' && (
            <GameStartScreen
              onStartGame={handleStartGame}
              onDailyChallenge={handleDailyChallenge}
            />
          )}
          {isLoading && (
            <div className="loading-overlay">
              <LoadingSpinner message="Traveling to next destination..." />
            </div>
          )}
          {isCalculating && (
            <div className="loading-overlay">
              <LoadingSpinner message="TRIANGULATING TARGET POSITION..." />
            </div>
          )}
          {!isLoading && !isCalculating && (gamePhase === 'guessing' || gamePhase === 'round_summary') && (
            <>
              {gamePhase === 'guessing' && (
                <TacticalHUD
                  intelPoints={intelPoints}
                  onActivateUplink={handleActivateUplink}
                  onActivateReport={handleActivateReport}
                  isUplinkActive={!!activeIntel.uplink}
                  isReportActive={hintRevealed}
                />
              )}
              <div className="container">
                <div className={`street-view-container ${gamePhase}`}>
                  <StreetView actualLocation={actualLocation} />
                </div>
                <div className={`map-container ${gamePhase}`}>
                  <MapContainer
                    playerGuess={playerGuess}
                    actualLocation={actualLocation}
                    handleMapClick={handleMapClick}
                    gamePhase={gamePhase}
                    activeIntel={activeIntel}
                  />
                  {gamePhase === 'guessing' && !playerGuess && (
                    <div className="map-hover-hint">Guess Here</div>
                  )}
                </div>
              </div>
              {gamePhase === 'guessing' && (
                <div className="guessing-controls">
                  <button
                    onClick={handleRevealHint}
                    disabled={hintRevealed}
                    className="secondary-action-button"
                    title={`Revealing a hint costs ${hintPenalty} points (Free if using Field Report)`}
                    style={{ opacity: hintSource === 'intel' ? 0.5 : 1 }}
                  >
                     {hintRevealed
                       ? (hintSource === 'intel' ? 'Intel Decrypted' : 'Hint Revealed')
                       : `Emergency Hint (-${hintPenalty})`}
                  </button>
                  <button
                    onClick={handleMakeGuess}
                    disabled={!playerGuess}
                    className="primary-action-button"
                  >
                    Make Guess
                  </button>
                </div>
              )}
              {gamePhase === 'guessing' && hintRevealed && (
                <div className="hint-display fade-in-section">
                  <p><strong>Hint:</strong> {actualLocation?.hint}</p>
                </div>
              )}
              {gamePhase === 'round_summary' && (
                <div className="round-summary-container fade-in-section">
                  <RoundInfoDisplay
                    distance={distance}
                    roundScore={roundScore}
                    totalScore={totalScore}
                    locationName={actualLocation?.name}
                    currentRound={currentRound}
                    totalRounds={locations.length}
                    funFact={actualLocation?.fun_fact}
                    missionBrief={actualLocation?.mission_brief}
                    hintPenalty={hintRevealed ? hintPenalty : 0}
                    streakBonus={distance < 1000 ? (currentStreak * 100) : 0}
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
