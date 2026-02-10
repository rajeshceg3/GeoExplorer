import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GeoExplorer title', () => {
  render(<App />);
  // Use getAllByText because "GEO-EXPLORER" appears in the header and in the start screen
  const titleElements = screen.getAllByText(/GEO-EXPLORER/i);
  expect(titleElements.length).toBeGreaterThan(0);
});

test('renders difficulty selection', async () => {
  render(<App />);
  const difficultyTitle = screen.getByText(/MISSION SELECT/i);
  expect(difficultyTitle).toBeInTheDocument();

  // Verify Blitz Protocol toggle is present
  const blitzToggle = screen.getByText(/BLITZ PROTOCOL/i);
  expect(blitzToggle).toBeInTheDocument();
});
