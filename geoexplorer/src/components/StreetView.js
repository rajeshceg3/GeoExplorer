import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import './StreetView.css';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export class StreetView extends Component {
  constructor(props) {
    super(props);
    this.streetViewRef = React.createRef();
    this.state = {
      panorama: null,
      serviceStatus: null, // To store status from StreetViewService
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
        this.setState({ serviceStatus: 'API_KEY_MISSING' });
        return;
    }

    if (!google || !google.maps) {
      this.setState({ serviceStatus: 'GOOGLE_API_NOT_LOADED' });
      return;
    }

    if (!actualLocation || !this.streetViewRef.current) {
      // If actualLocation is null or ref is not available, do nothing.
      // This can happen if props are not ready yet.
      if (!actualLocation) this.setState({ serviceStatus: 'LOCATION_MISSING' });
      return;
    }

    const streetViewService = new google.maps.StreetViewService();
    const locationLatLng = new google.maps.LatLng(actualLocation.lat, actualLocation.lng);

    streetViewService.getPanorama(
      { location: locationLatLng, radius: 50, source: google.maps.StreetViewSource.OUTDOOR },
      (data, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
          this.setState({ serviceStatus: 'OK', panorama: true }); // panorama state to true just to indicate it's loaded
          const panorama = new google.maps.StreetViewPanorama(
            this.streetViewRef.current,
            {
              position: data.location.latLng,
              pov: { heading: 34, pitch: 10 },
              zoom: 1,
              addressControl: false,
              linksControl: false,
              panControl: true,
              enableCloseButton: false,
              fullscreenControl: false,
              motionTracking: false,
              motionTrackingControl: false,
            }
          );
          // panorama.setVisible(true); // Not strictly needed, it's visible by default
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

    if (this.state.serviceStatus === 'API_KEY_MISSING') {
        content = (
            <div className="street-view-info">
                <p>Street View Panorama</p>
                <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
                <small>API key is missing. Street View cannot be displayed.</small>
            </div>
        );
    } else if (this.state.serviceStatus === 'GOOGLE_API_NOT_LOADED' && !this.props.google) {
         content = (
            <div className="street-view-info">
                <p>Street View Panorama</p>
                <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
                <small>Google Maps API not loaded yet. Waiting for map services...</small>
            </div>
         );
    } else if (this.state.serviceStatus === 'LOCATION_MISSING' && !this.props.actualLocation) {
        content = (
            <div className="street-view-info">
                <p>Street View Panorama</p>
                <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
                <small>Waiting for location data...</small>
            </div>
        );
    }
    else if (this.state.serviceStatus && this.state.serviceStatus !== 'OK') {
      content = (
        <div className="street-view-info">
          <p>Street View Not Available</p>
          <img src={placeholderImageUrl} alt="Street View Unavailable" className="street-view-image" />
          <small>
            Could not load Street View for this location (Reason: {this.state.serviceStatus}).
          </small>
        </div>
      );
    }

    // If no error content has been set, and API key is present, render the panorama div.
    // The panorama div is also rendered when serviceStatus is 'OK'.
    if (!content && apiKey) {
         content = <div ref={this.streetViewRef} className="street-view-image" style={{ height: '100%', width: '100%' }}></div>;
    } else if (!content && !apiKey) { // Fallback if apiKey just became missing after initial checks (unlikely)
        content = (
            <div className="street-view-info">
                <p>Street View Panorama</p>
                <img src={placeholderImageUrl} alt="Street View Placeholder" className="street-view-image" />
                <small>API key is missing. Street View cannot be displayed.</small>
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
