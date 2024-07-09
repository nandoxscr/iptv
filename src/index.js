// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { PlaylistProvider } from './context/PlaylistContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <PlaylistProvider>
      <App />
    </PlaylistProvider>
  </Router>
);