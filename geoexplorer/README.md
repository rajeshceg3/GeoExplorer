# GeoExplorer

A React-based geographical guessing game where players explore locations through Street View and guess where they are on an interactive map.

## 🎮 How to Play

1. You'll be shown a Street View panorama of a famous location
2. Explore the 360-degree view to gather clues about your location
3. Click on the world map to place your guess
4. See how close you were and earn points based on accuracy
5. Complete 5 rounds and see your total score!

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Google Maps API Key (see setup below)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd geoexplorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (see **API Configuration** below)

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the game

## 🔧 API Configuration

### Google Maps API Setup

**This step is REQUIRED for the game to work properly.**

1. **Get a Google Maps API Key:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - **Important**: Enable these APIs for your project:
     - Maps JavaScript API
     - Street View Static API

2. **Configure the API Key:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and replace `your_google_maps_api_key_here` with your actual API key:
     ```
     REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBwgGlbUiuS-oKrPQFMQkrPQFMQkrPQFM
     ```

3. **Optional: Google Sign-In Setup**
   - For user authentication, also add your Google OAuth Client ID:
     ```
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
     ```

### Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production deployment, set environment variables through your hosting platform

## 🎯 Game Features

- **Street View Integration**: Explore real locations through Google Street View
- **Interactive World Map**: Click to place your guesses
- **Scoring System**: Points based on distance accuracy
- **Multiple Rounds**: 5 famous landmarks per game
- **User Profiles**: Google Sign-In with game statistics
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Google Sign-In Setup

To enable Google Sign-In functionality for development or deployment, you need to obtain a Google Client ID.

1.  **Obtain a Google Client ID**:
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project or select an existing one.
    *   Navigate to "APIs & Services" > "Credentials".
    *   Click on "Create Credentials" and select "OAuth client ID".
    *   Choose "Web application" as the application type.
    *   Configure the authorized JavaScript origins and redirect URIs. For local development, you might use:
        *   Authorized JavaScript origins: `http://localhost:3000`
        *   Authorized redirect URIs: `http://localhost:3000`
    *   After creation, your Client ID will be displayed.

2.  **Update the Application**:
    *   Open the file `geoexplorer/src/App.js`.
    *   Find the line where the `SignIn` component is rendered:
        ```javascript
        <SignIn googleClientId="YOUR_GOOGLE_CLIENT_ID_HERE" />
        ```
    *   Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with the actual Client ID you obtained from the Google Cloud Console.

### Note on Installing `google-auth-library`

When installing the `google-auth-library` package via npm, you might encounter peer dependency conflicts, particularly with `react`. If this occurs, you can use the `--legacy-peer-deps` flag as a workaround:

```bash
npm install google-auth-library --legacy-peer-deps
```
This should help resolve the conflicts and allow the installation to proceed.
