import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';
import '../src/Styles/index.css';

// Replace ReactDOM.render with createRoot
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
