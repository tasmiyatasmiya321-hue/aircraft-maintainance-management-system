import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign Vite HMR / WebSocket connection errors in container environment from triggering unhandled rejection overlays
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason?.stack || event.reason || '').toLowerCase();
    if (reasonStr.includes('websocket') || reasonStr.includes('vite') || reasonStr.includes('ws')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorStr = String(event.message || event.error?.message || '').toLowerCase();
    if (errorStr.includes('websocket') || errorStr.includes('vite') || errorStr.includes('ws')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

