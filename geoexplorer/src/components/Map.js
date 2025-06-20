import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './Map.css'; // We'll create this CSS file next

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      apiKeyMissing: false,
    };
  }

  componentDidMount() {
    // Check if the Google Maps API script loaded, which might indicate API key issues
    // google-maps-react loads the script itself. If window.google is not available soon after,
    // it might be due to a missing or invalid API key.
    // This is a heuristic check. The library might show its own errors/watermarks.
    setTimeout(() => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API not loaded. API key might be missing or invalid.");
        this.setState({ apiKeyMissing: true });
      }
    }, 3000); // Wait a bit for the script to potentially load
  }

  onMapClicked = (mapProps, map, clickEvent) => {
    if (this.state.apiKeyMissing) return; // Don't add markers if API key is missing

    const { latLng } = clickEvent;
    const newMarker = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };
    this.setState(prevState => ({
      markers: [...prevState.markers, newMarker],
    }));
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
          {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              name={`Pinned Location ${index + 1}`}
            />
          ))}
        </Map>
        <div className="map-instructions">
          <p>Click on the map to place a pin.</p>
          {this.props.google && !this.props.google.maps ? <p><small>(Map functionality may be limited without a valid API key)</small></p> : null}
        </div>
      </div>
    );
  }
}

// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with an actual API key if available.
// Since it's not, the map will likely show "For development purposes only" or an error.
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

if (!apiKey) {
  console.warn("Google Maps API key is missing. Map functionality will be limited or unavailable.");
}

export default GoogleApiWrapper({
  apiKey: apiKey,
  // Note: If no apiKey is provided, google-maps-react might still try to load the API
  // and Google will respond with an error or a watermarked map.
  // The component includes a check for `window.google.maps` to display a more user-friendly message.
})(MapContainer);
