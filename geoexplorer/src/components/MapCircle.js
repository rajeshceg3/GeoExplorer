import { Component } from 'react';

export class MapCircle extends Component {
  componentDidMount() {
    this.renderCircle();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.map !== prevProps.map ||
      this.props.center?.lat !== prevProps.center?.lat ||
      this.props.center?.lng !== prevProps.center?.lng ||
      this.props.radius !== prevProps.radius
    ) {
      if (this.circle) {
        this.circle.setMap(null);
      }
      this.renderCircle();
    }
  }

  componentWillUnmount() {
    if (this.circle) {
      this.circle.setMap(null);
    }
  }

  renderCircle() {
    const { map, google, center, radius, options } = this.props;
    if (!google || !map || !center || !radius) return;

    const circleOptions = {
      center: center,
      radius: radius,
      clickable: false, // Default to non-clickable for overlays
      ...options
    };

    this.circle = new google.maps.Circle(circleOptions);
    this.circle.setMap(map);
  }

  render() {
    return null;
  }
}

export default MapCircle;
