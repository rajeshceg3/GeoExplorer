# Bugs and Areas for Improvement

This document lists identified bugs, potential issues, and areas for improvement in the GeoExplorer application.

## Critical Bugs

*   **CB-1: API Key Not Integrated for Street View:**
    *   **File:** `geoexplorer/src/components/StreetView.js`
    *   **Description:** The Street View component displays a placeholder SVG image instead of actual Street View panoramas. It requires integration with the Google Street View API, which needs a valid Google Maps API key.
    *   **Impact:** Core gameplay feature (viewing locations) is non-functional.

## Major Bugs

*   **MJB-1: Inconsistent and Insecure API Key Handling for Maps:**
    *   **File:** `geoexplorer/src/components/Map.js`
    *   **Description:** The Google Maps API key is referenced via `process.env.REACT_APP_GOOGLE_MAPS_API_KEY` but also has a fallback to an empty string `''`. The code also contains commented-out placeholders like `'YOUR_GOOGLE_MAPS_API_KEY'`. API keys should be managed strictly through environment variables and not hardcoded or have insecure fallbacks.
    *   **Impact:** Potential for map display failures or insecure key exposure if misconfigured.
    *   **Suggestion:** Remove hardcoded fallbacks and rely solely on `process.env.REACT_APP_GOOGLE_MAPS_API_KEY`. Ensure build process correctly handles these variables.

*   **MJB-2: Hardcoded Game Locations:**
    *   **File:** `geoexplorer/src/App.js`
    *   **Description:** The `gameLocations` array is hardcoded directly in the `App.js` file. This makes it difficult to update or expand the list of locations without modifying the core application code.
    *   **Impact:** Limited content, difficult to maintain and scale the game's location pool.
    *   **Suggestion:** Move locations to a separate JSON file, or fetch from a backend service if the application were to be expanded significantly.

## Minor Bugs

*   **MNB-1: Heuristic API Key Check for Maps:**
    *   **File:** `geoexplorer/src/components/Map.js`
    *   **Description:** The `componentDidMount` method in `MapContainer` uses a `setTimeout` to check if `window.google.maps` is loaded, as a way to infer if the API key is missing or invalid. This is a heuristic and might not be reliable.
    *   **Impact:** Error message for API key issues might be inaccurate or delayed.
    *   **Suggestion:** Utilize the `onGoogleApiLoaded` prop provided by `google-maps-react` for a more robust way to confirm API readiness or handle loading errors.

*   **MNB-2: Potentially Unclear State Reset in `handlePlayAgain`:**
    *   **File:** `geoexplorer/src/App.js`
    *   **Description:** In the `handlePlayAgain` function, `setActualLocation(locations[0])` is commented out, with a note that `useEffect` will set it. While this works, explicitly resetting all relevant game state in one place can improve clarity and reduce the risk of issues if `useEffect` dependencies or logic change.
    *   **Impact:** Low, but could lead to confusion or subtle bugs during future refactoring.
    *   **Suggestion:** Consider uncommenting `setActualLocation(locations[0])` or ensuring all state resets are explicitly handled within `handlePlayAgain` for better maintainability.

## Areas for Improvement

*   **AFI-1: Configuration Management:**
    *   **Files:** `geoexplorer/src/App.js`, `geoexplorer/src/utils/geometry.js`, `geoexplorer/src/components/Map.js`
    *   **Description:**
        *   API keys should be exclusively managed via environment variables (e.g., `.env` files for local development, and proper environment configuration for deployment).
        *   Game parameters like `MAX_DISTANCE_FOR_SCORE`, `MAX_SCORE` in `geometry.js`, and the number of rounds (currently derived from `gameLocations.length`) could be made configurable instead of being hardcoded.
    *   **Benefit:** Easier maintenance, better security for API keys, and more flexible game customization.

*   **AFI-2: Enhanced User Experience (UX):**
    *   **Files:** `geoexplorer/src/components/StreetView.js`, `geoexplorer/src/components/Map.js`
    *   **Description:**
        *   Provide loading indicators or more informative messages to the user while APIs (especially Street View) are loading or if they fail.
        *   The map in `Map.js` defaults to San Francisco. Consider no initial center, a more neutral world view, or centering on a relevant point if applicable (e.g., previous round's location).
    *   **Benefit:** Smoother and more intuitive user experience.

*   **AFI-3: Code Structure and Readability:**
    *   **Files:** `geoexplorer/src/utils/geometry.js`
    *   **Description:** Constants like `MAX_DISTANCE_FOR_SCORE` and `MAX_SCORE` in `geometry.js` could be grouped at the top of the file or managed in a dedicated configuration module for better organization.
    *   **Benefit:** Improved code clarity and maintainability.

*   **AFI-4: Comprehensive Testing:**
    *   **Files:** `geoexplorer/src/App.test.js` (and others)
    *   **Description:** The existing test suite (`App.test.js` content not reviewed but assumed basic) should be expanded with more comprehensive unit and integration tests. This includes testing game logic (state transitions, score calculation), component interactions, and API integrations (potentially with mocks).
    *   **Benefit:** Increased code reliability, easier refactoring, and fewer regressions.

*   **AFI-5: Styling Consistency:**
    *   **Files:** e.g., `geoexplorer/src/components/GameOverScreen.js`
    *   **Description:** Comments like `// Optional: import './GameOverScreen.css';` suggest that styling might be incomplete or applied inconsistently. A more unified approach to component styling would improve the application's visual presentation.
    *   **Benefit:** Consistent and polished user interface.

*   **AFI-6: Error Handling in Map Component:**
    *   **File:** `geoexplorer/src/components/Map.js`
    *   **Description:** While there's a message for missing API keys, more general error handling for other map loading issues or runtime errors from the Google Maps API could be beneficial.
    *   **Benefit:** More robust application that can gracefully handle unexpected map issues.
