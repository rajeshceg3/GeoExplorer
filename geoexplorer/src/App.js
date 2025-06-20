import './App.css';
import StreetView from './components/StreetView';
import MapContainer from './components/Map'; // Import the Map component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GeoExplorer</h1>
      </header>
      <div className="container">
        <div className="street-view-container">
          <StreetView />
        </div>
        <div className="map-container">
          <MapContainer /> {/* Use the MapContainer component */}
        </div>
      </div>
    </div>
  );
}

export default App;
