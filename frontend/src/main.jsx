import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React app entrypoint — ReactDOM.createRoot(...).render(<App />)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
