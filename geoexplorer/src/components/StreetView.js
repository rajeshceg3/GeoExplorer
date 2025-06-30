import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import LoadingSpinner from './LoadingSpinner';
import './StreetView.css';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export class StreetView extends Component {
  constructor(props) {
    super(props);
    this.streetViewRef = React.createRef();
    this.state = {
      panorama: null,
      serviceStatus: null, // To store status from StreetViewService
      isLoading: false, // Track loading state
    };
  }

  componentDidMount() {
    if (!apiKey) {
      console.warn("StreetView: Google Maps API key is missing.");
      this.setState({ serviceStatus: 'API_KEY_MISSING' });
    }
    // Attempt to load panorama only if API key exists and google object is available
    if (apiKey && this.props.google && this.props.actualLocation) {
      this.loadPanorama();
    } else if (apiKey && !this.props.google) {
      // If google object not yet available, componentDidUpdate will handle it
      this.setState({ serviceStatus: 'GOOGLE_API_NOT_LOADED' });
    }
  }

  componentDidUpdate(prevProps) {
    const { google, actualLocation } = this.props;
    let panoramaLoadedOrAttempted = !!this.state.panorama || this.state.serviceStatus !== null && this.state.serviceStatus !== 'GOOGLE_API_NOT_LOADED' ;

    // Case 1: actualLocation changed
    if (actualLocation && prevProps.actualLocation !== actualLocation) {
      this.loadPanorama();
    }
    // Case 2: google object becomes available later (and wasn't available before)
    else if (google && !prevProps.google && actualLocation && !panoramaLoadedOrAttempted) {
        this.loadPanorama();
    }
    // Case 3: actualLocation becomes available later (and wasn't available before, google is ready)
    else if (actualLocation && !prevProps.actualLocation && google && !panoramaLoadedOrAttempted) {
        this.loadPanorama();
    }
  }

  loadPanorama = () => {
    const { google, actualLocation } = this.props;

    if (!apiKey) {
        this.setState({ serviceStatus: 'API_KEY_MISSING', isLoading: false });
        return;
    }

    if (!google || !google.maps) {
      this.setState({ serviceStatus: 'GOOGLE_API_NOT_LOADED', isLoading: false });
      return;
    }

    if (!actualLocation || !this.streetViewRef.current) {
      // If actualLocation is null or ref is not available, do nothing.
      // This can happen if props are not ready yet.
      if (!actualLocation) this.setState({ serviceStatus: 'LOCATION_MISSING', isLoading: false });
      return;
    }

    // Set loading state when starting to load panorama
    this.setState({ isLoading: true, serviceStatus: null });

    const streetViewService = new google.maps.StreetViewService();
    const locationLatLng = new google.maps.LatLng(actualLocation.lat, actualLocation.lng);

    streetViewService.getPanorama(
      { 
        location: locationLatLng, 
        radius: 100, // Increased radius for better coverage
        source: google.maps.StreetViewSource.OUTDOOR 
      },
      (data, status) => {
        this.setState({ isLoading: false });
        
        if (status === google.maps.StreetViewStatus.OK) {
          this.setState({ serviceStatus: 'OK', panorama: true });
          const panorama = new google.maps.StreetViewPanorama(
            this.streetViewRef.current,
            {
              position: data.location.latLng,
              pov: { 
                heading: Math.random() * 360, // Random initial heading for variety
                pitch: 0 // Level view
              },
              zoom: 1,
              addressControl: false,
              linksControl: false,
              panControl: true,
              enableCloseButton: false,
              fullscreenControl: false,
              motionTracking: false,
              motionTrackingControl: false,
              showRoadLabels: false, // Hide road labels to make it more challenging
            }
          );
        } else {
          console.error('Street View service failed for location:', actualLocation, 'Status:', status);
          this.setState({ serviceStatus: status, panorama: false });
        }
      }
    );
  };

  render() {
    const placeholderImageUrl = process.env.PUBLIC_URL + '/street_view_placeholder.svg';
    let content;

    // Loading state
    if (this.state.isLoading) {
      content = <LoadingSpinner message="Loading Street View..." />;
    }
    // API Key missing
    else if (this.state.serviceStatus === 'API_KEY_MISSING') {
      content = (
        <div className="street-view-info">
          <h3>Setup Required</h3>
          <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
          <div className="error-details">
            <p>Google Maps API key is missing.</p>
            <small>
              To enable Street View, add your Google Maps API key to the environment variables.
              <br />See the README for setup instructions.
            </small>
          </div>
        </div>
      );
    }
    // Google API not loaded
    else if (this.state.serviceStatus === 'GOOGLE_API_NOT_LOADED' && !this.props.google) {
      content = <LoadingSpinner message="Loading Google Maps API..." />;
    }
    // Location missing
    else if (this.state.serviceStatus === 'LOCATION_MISSING' && !this.props.actualLocation) {
      content = <LoadingSpinner message="Waiting for location data..." />;
    }
    // Street View service error
    else if (this.state.serviceStatus && this.state.serviceStatus !== 'OK') {
      content = (
        <div className="street-view-info">
          <h3>Street View Unavailable</h3>
          <img src={placeholderImageUrl} alt="Street View Unavailable" className="street-view-image" />
          <div className="error-details">
            <p>Street View is not available for this location.</p>
            <small>
              This might be due to the location being in a remote area or privacy restrictions.
              <br />Status: {this.state.serviceStatus}
            </small>
          </div>
        </div>
      );
    }
    // Success case - render panorama
    else if (apiKey && this.state.serviceStatus === 'OK') {
      content = <div ref={this.streetViewRef} className="street-view-panorama" />;
    }
    // Initial state - waiting for data
    else if (apiKey) {
      content = <LoadingSpinner message="Initializing Street View..." />;
    }
    // Fallback
    else {
      content = (
        <div className="street-view-info">
          <h3>Setup Required</h3>
          <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
          <div className="error-details">
            <p>Google Maps API key is missing.</p>
            <small>Please configure your API key to enable Street View.</small>
          </div>
        </div>
      );
    }

    return (
      <div className="street-view-wrapper">
        {content}
      </div>
    );
  }
}

export default GoogleApiWrapper(
  // (props) => // Removed props here, as API key is module-level
  {
    apiKey: apiKey, // apiKey is already defined in the module scope
    // LoadingContainer: can be a simple div or a custom loading component
    // We are handling loading/error states internally, so a generic LoadingContainer might interfere
    // or not be needed if the internal handling is sufficient.
  }
)(StreetView);
