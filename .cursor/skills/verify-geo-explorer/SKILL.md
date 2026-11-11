# Verify GeoExplorer
GeoExplorer - map guessing game (create-react-app in geoexplorer/ subdir).
## Launch
`cd geoexplorer && npm install --legacy-peer-deps` (google-maps-react predates react 19), then `npm start` or `npm run build`.
## Doctor
`python3 .cursor/skills/verify-geo-explorer/verify.py`
## Drive
Installs with legacy peer resolution, runs the react-scripts tests (2), builds the production bundle, then renders the built app in headless Chromium.
## Evidence
`.cursor/skills/verify-geo-explorer/evidence.json`
## Cleanup
Static server terminated after the render.
## Known boundaries
react-scripts build emits pre-existing eslint warnings (exhaustive-deps, unused vars); the Google sign-in path is untested.
