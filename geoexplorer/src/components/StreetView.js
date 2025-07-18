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
      serviceStatus: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (apiKey && this.props.google && this.props.actualLocation) {
      this.loadPanorama();
    }
  }

  componentDidUpdate(prevProps) {
    const { google, actualLocation } = this.props;
    if (actualLocation && prevProps.actualLocation !== actualLocation) {
      this.loadPanorama();
    } else if (google && !prevProps.google && actualLocation) {
      this.loadPanorama();
    }
  }

  loadPanorama = () => {
    const { google, actualLocation } = this.props;

    if (!apiKey || !google || !google.maps || !actualLocation || !this.streetViewRef.current) {
      this.setState({ serviceStatus: 'ERROR', isLoading: false });
      return;
    }

    this.setState({ isLoading: true, serviceStatus: null });

    const streetViewService = new google.maps.StreetViewService();
    const locationLatLng = new google.maps.LatLng(actualLocation.lat, actualLocation.lng);

    streetViewService.getPanorama(
      {
        location: locationLatLng,
        radius: 100,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        this.setState({ isLoading: false });

        if (status === google.maps.StreetViewStatus.OK) {
          this.setState({ serviceStatus: 'OK', panorama: true });
          new google.maps.StreetViewPanorama(
            this.streetViewRef.current,
            {
              position: data.location.latLng,
              pov: { heading: Math.random() * 360, pitch: 0 },
              zoom: 1,
              addressControl: false,
              linksControl: false,
              panControl: true,
              enableCloseButton: false,
              fullscreenControl: false,
              motionTracking: false,
              motionTrackingControl: false,
              showRoadLabels: false,
            }
          );
        } else {
          this.setState({ serviceStatus: status, panorama: false });
        }
      }
    );
  };

  render() {
    const { isLoading, serviceStatus } = this.state;

    if (isLoading) {
      return <LoadingSpinner message="Loading Street View..." />;
    }

    if (serviceStatus && serviceStatus !== 'OK') {
      return <div className="street-view-error">Street View Unavailable</div>;
    }

    return <div ref={this.streetViewRef} className="street-view-panorama" style={{ width: '100%', height: '100%' }} />;
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey,
})(StreetView);
