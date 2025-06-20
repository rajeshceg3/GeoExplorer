import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import './Map.css'; // We'll create this CSS file next

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    // The apiKey constant is defined at the module level:
    // const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    this.state = {
      apiKeyMissing: !apiKey, // Set true if apiKey is falsy (undefined, null, empty string)
    };
  }

  // componentDidMount() {
  //   // Check if the Google Maps API script loaded, which might indicate API key issues
  //   // google-maps-react loads the script itself. If window.google is not available soon after,
  //   // it might be due to a missing or invalid API key.
  //   // This is a heuristic check. The library might show its own errors/watermarks.
  //   setTimeout(() => {
  //     if (!window.google || !window.google.maps) {
  //       console.error("Google Maps API not loaded. API key might be missing or invalid.");
  //       this.setState({ apiKeyMissing: true });
  //     }
  //   }, 3000); // Wait a bit for the script to potentially load
  // }

  onMapClicked = (mapProps, map, clickEvent) => {
    // It's good practice to also check if google API loaded successfully before interacting with map
    // However, apiKeyMissing check already gatekeeps this. If key was missing, map shouldn't be interactive.
    // If key IS present but API fails to load, google-maps-react might not render the map,
    // or this.props.google might be undefined.
    if (this.state.apiKeyMissing || !this.props.google || !this.props.loaded) return;

    // Call handleMapClick from props if gamePhase is 'guessing'
    if (this.props.gamePhase === 'guessing' && this.props.handleMapClick) {
      const { latLng } = clickEvent;
      this.props.handleMapClick({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    }
    // The logic to set local marker state is removed.
    // Player's guess is now managed by App.js and passed via playerGuess prop.
  };

  render() {
    if (this.state.apiKeyMissing) {
      return (
        <div className="map-api-key-missing-error">
          <h2>Map Display Error</h2>
          <p>
            The Google Maps API key is missing or invalid.
            An API key is required to display the interactive map.
          </p>
          <p>
            Please ensure a valid <code>GOOGLE_MAPS_API_KEY</code> is provided
            when building the application.
          </p>
        </div>
      );
    }

    // Default center (San Francisco) - will be used if map loads
    const initialCenter = { lat: 37.7749, lng: -122.4194 };
    // Default zoom
    const zoomLevel = 10;

    return (
      <div className="map-wrapper">
        <Map
          google={this.props.google}
          zoom={zoomLevel}
          initialCenter={initialCenter}
          onClick={this.onMapClicked}
          containerStyle={{ position: 'relative', width: '100%', height: '100%' }}
          className="interactive-map"
        >
          {/* Display player's guess marker from props */}
          {this.props.playerGuess && (
            <Marker
              position={{ lat: this.props.playerGuess.lat, lng: this.props.playerGuess.lng }}
              name="Your Guess"
            />
          )}
          {/* Display actual location marker during round summary */}
          {this.props.gamePhase === 'round_summary' && this.props.actualLocation && (
            <Marker
              position={this.props.actualLocation}
              name={'Actual Location'}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              }}
            />
          )}
          {/* Draw Polyline between guess and actual location during round summary */}
          {this.props.gamePhase === 'round_summary' &&
            this.props.playerGuess &&
            this.props.actualLocation && (
              <Polyline
                path={[this.props.playerGuess, this.props.actualLocation]}
                options={{
                  strokeColor: '#FF6F00', // Updated to accent color
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
        </Map>
        <div className="map-instructions">
          {this.props.gamePhase === 'guessing' && <p>Click on the map to place your guess.</p>}
          {this.props.gamePhase === 'round_summary' && <p>Check your guess against the actual location!</p>}
          {this.props.gamePhase === 'game_over' && <p>Game Over! Thanks for playing.</p>}
          {this.props.google && !this.props.google.maps ? <p><small>(Map functionality may be limited without a valid API key)</small></p> : null}
        </div>
      </div>
    );
  }
}

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.warn("Google Maps API key is missing. Map functionality will be limited or unavailable.");
}

export default GoogleApiWrapper({
  apiKey: apiKey, // This should be just `apiKey` as it's defined in the module scope
  // Note: If no apiKey is provided, google-maps-react might still try to load the API
  // and Google will respond with an error or a watermarked map.
  // The component's apiKeyMissing state now directly reflects if the key was initially provided.
})(MapContainer);
