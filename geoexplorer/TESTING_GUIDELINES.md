# GeoExplorer Testing Guidelines

This document outlines recommended test cases to ensure the GeoExplorer application functions correctly, especially after recent modifications. These tests should ideally be implemented using a framework like Jest and React Testing Library, with appropriate mocking for external services like Google Maps API.

## 1. API Key Handling and Configuration

*   **`Map.js` - API Key Missing:**
    *   **Test:** Verify that if `process.env.REACT_APP_GOOGLE_MAPS_API_KEY` is undefined or empty, the `MapContainer` renders its specific error message regarding the missing API key.
    *   **Mock:** Mock `process.env.REACT_APP_GOOGLE_MAPS_API_KEY`.
*   **`StreetView.js` - API Key Missing:**
    *   **Test:** Verify that if `process.env.REACT_APP_GOOGLE_MAPS_API_KEY` is undefined or empty, the `StreetView` component renders its specific error message/placeholder.
    *   **Mock:** Mock `process.env.REACT_APP_GOOGLE_MAPS_API_KEY`.
*   **(Manual) Valid API Key:**
    *   **Test:** When a valid API key is provided, verify that the map in `Map.js` loads and `StreetView.js` attempts to load panoramas.
*   **(Manual) Invalid API Key:**
    *   **Test:** If an invalid (but present) API key is provided, observe and document the behavior of `Map.js` and `StreetView.js` (e.g., Google Maps watermarks, errors from the library).

## 2. Street View Functionality (`StreetView.js`)

*   **Setup:** Mock `google.maps.StreetViewService` and `google.maps.StreetViewPanorama`. Mock `this.props.google` and `this.props.actualLocation`.
*   **Panorama Loading on Prop Change:**
    *   **Test:** Verify `loadPanorama` (or the Street View service call within it) is triggered when the `actualLocation` prop changes.
*   **Successful Panorama Display:**
    *   **Test:** If `StreetViewService.getPanorama` returns `OK`, verify the panorama div (`streetViewRef`) is rendered (or that `StreetViewPanorama` constructor is called with correct parameters).
*   **Street View Not Available (e.g., `ZERO_RESULTS`):**
    *   **Test:** If `StreetViewService.getPanorama` returns a status like `ZERO_RESULTS`, verify an appropriate error message or placeholder is displayed.
*   **Google API Not Loaded:**
    *   **Test:** If `this.props.google` is not available, verify a "Google API not loaded" message is shown.

## 3. Game Location Handling (`App.js`, `locations.json`)

*   **Location Loading:**
    *   **Test:** Verify that `App.js` loads initial game locations from `locations.json` (mock the import of `locations.json` to provide controlled test data).
*   **Initial Location Setting:**
    *   **Test:** Verify `actualLocation` state in `App.js` is set to the first location from the loaded data upon game initialization.

## 4. State Reset in `handlePlayAgain` (`App.js`)

*   **Full State Reset:**
    *   **Test:** After simulating a game round and then calling `handlePlayAgain`, verify all relevant state variables are reset to their initial game start values:
        *   `currentRound` (to 1)
        *   `gamePhase` (to 'guessing')
        *   `playerGuess` (to null)
        *   `actualLocation` (to the first location)
        *   `distance` (to null)
        *   `roundScore` (to 0)
        *   `totalScore` (to 0)
        *   `roundScores` (to an empty array)

## 5. Map Click Logic and Guessing Phase (`App.js`, `Map.js`)

*   **Guessing Phase Click:**
    *   **Test:** When `gamePhase` is 'guessing', simulate a map click in `MapContainer`. Verify `handleMapClick` in `App.js` is called and `playerGuess` state is updated.
*   **Non-Guessing Phase Click:**
    *   **Test:** When `gamePhase` is not 'guessing' (e.g., 'round_summary'), simulate a map click. Verify `playerGuess` state is NOT updated.
*   **"Make Guess" Button State:**
    *   **Test:** Verify the "Make Guess" button in `App.js` is disabled when `playerGuess` is null and enabled when `playerGuess` has a value.

## 6. Score Calculation (`App.js`, `utils/geometry.js`)

*   **`calculateDistance` Function:**
    *   **Test:** Unit test `calculateDistance` with known latitude/longitude pairs and expected distances. Include edge cases if any.
*   **`calculateScore` Function:**
    *   **Test:** Unit test `calculateScore` with various distances:
        *   Distance < 0.25 km (should give `MAX_SCORE`).
        *   Distance > `MAX_DISTANCE_FOR_SCORE` (should give 0).
        *   Distances within the scoring range.
*   **Score State Updates in `App.js`:**
    *   **Test:** After a guess is made and `gamePhase` becomes 'round_summary', verify `distance`, `roundScore`, `totalScore`, and `roundScores` are correctly calculated and updated in `App.js` state.

## 7. Game Flow (`App.js`)

*   **Round Progression:**
    *   **Test:** Simulate a full round: make a guess, advance to summary, click "Next Round". Verify `currentRound` increments, and states are reset for the new round (`playerGuess`, `distance`, `roundScore`, `gamePhase` to 'guessing').
*   **Game Over Transition:**
    *   **Test:** After the last round, verify clicking "Show Final Score" (or equivalent) transitions `gamePhase` to 'game_over'.
*   **Game Over Screen Display:**
    *   **Test:** When `gamePhase` is 'game_over', verify the `GameOverScreen` component is rendered with correct `totalScore` and `roundScores`.

## 8. General Component Rendering

*   **Basic Rendering:**
    *   **Test:** Ensure all major components (`App`, `MapContainer`, `StreetView`, `GameOverScreen`, `RoundInfoDisplay`) render without crashing.
```
