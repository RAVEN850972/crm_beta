// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Performance monitoring
import { reportWebVitals } from './utils/reportWebVitals';

// Error boundary for production
if (process.env.NODE_ENV === 'production') {
  // Initialize Sentry or other error tracking
  import('./utils/sentry').then(({ initSentry }) => {
    initSentry();
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measuring
reportWebVitals();