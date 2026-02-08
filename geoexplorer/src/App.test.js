import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GeoExplorer title', () => {
  render(<App />);
  // Use getAllByText because "GEO-EXPLORER" appears in the header and in the start screen
  const titleElements = screen.getAllByText(/GEO-EXPLORER/i);
  expect(titleElements.length).toBeGreaterThan(0);
});

test('renders difficulty selection', () => {
  render(<App />);
  const difficultyTitle = screen.getByText(/SELECT CLEARANCE LEVEL/i);
  expect(difficultyTitle).toBeInTheDocument();
});
