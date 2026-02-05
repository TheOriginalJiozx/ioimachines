import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

async function loadConfig() {
  try {
    const resp = await fetch('/api/config');
    if (resp.ok) {
      const content = resp.headers.get('content-type') || '';
      if (content.includes('application/json')) {
        const json = await resp.json();
        window.__APP_CONFIG__ = json || {};
        return;
      } else {
        console.warn('Config endpoint returned non-JSON content-type:', content);
      }
    }
  } catch (error) {
    console.warn('Error loading config:', error.message);
  }
  window.__APP_CONFIG__ = {};
}

async function start() {
  await loadConfig();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  reportWebVitals();
}

start();
