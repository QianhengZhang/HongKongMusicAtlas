import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider, MapProvider, AudioProvider } from './contexts';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppProvider>
    <MapProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </MapProvider>
  </AppProvider>
);

console.log('React app rendered');
