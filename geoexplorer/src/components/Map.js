import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import './Map.css';
import MapCircle from './MapCircle';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export class MapContainer extends Component {
  onMapClicked = (mapProps, map, clickEvent) => {
    if (this.props.gamePhase === 'guessing' && this.props.handleMapClick) {
      const { latLng } = clickEvent;
      this.props.handleMapClick({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    }
  };

  render() {
    if (!apiKey) {
      return (
        <div className="map-api-key-missing-error">
          Map requires a Google Maps API key.
        </div>
      );
    }

    const initialCenter = { lat: 37.7749, lng: -122.4194 };
    const zoomLevel = 1;

    return (
      <Map
        google={this.props.google}
        zoom={zoomLevel}
        initialCenter={initialCenter}
        onClick={this.onMapClicked}
        containerStyle={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px' }}
        className="interactive-map"
        disableDefaultUI={true}
      >
        {this.props.activeIntel && this.props.activeIntel.uplink && (
          <MapCircle
            center={this.props.activeIntel.uplink.center}
            radius={this.props.activeIntel.uplink.radius * 1000} // Convert km to meters
            options={{
              fillColor: '#34c759',
              fillOpacity: 0.15,
              strokeColor: '#34c759',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
        {this.props.playerGuess && (
          <Marker
            position={{ lat: this.props.playerGuess.lat, lng: this.props.playerGuess.lng }}
            name="Your Guess"
            icon={{
              path: this.props.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#007aff',
              fillOpacity: 1,
              strokeWeight: 0,
            }}
          />
        )}
        {this.props.gamePhase === 'round_summary' && this.props.actualLocation && (
          <Marker
            position={this.props.actualLocation}
            name={'Actual Location'}
            icon={{
              path: this.props.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#34c759',
              fillOpacity: 1,
              strokeWeight: 0,
            }}
          />
        )}
        {this.props.gamePhase === 'round_summary' &&
          this.props.playerGuess &&
          this.props.actualLocation && (
            <Polyline
              path={[this.props.playerGuess, this.props.actualLocation]}
              options={{
                strokeColor: '#007aff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey,
})(MapContainer);
