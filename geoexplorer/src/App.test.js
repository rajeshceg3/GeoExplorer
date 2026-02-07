import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GeoExplorer title', () => {
  render(<App />);
  // Use getAllByText because "GeoExplorer" appears in the header and in the start screen
  const titleElements = screen.getAllByText(/GeoExplorer/i);
  expect(titleElements.length).toBeGreaterThan(0);
});

test('renders difficulty selection', () => {
  render(<App />);
  const difficultyTitle = screen.getByText(/Select Difficulty/i);
  expect(difficultyTitle).toBeInTheDocument();
});
