import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/app.css';
import App from './App';
import { ScrollPrologueController } from './prologue/ScrollPrologueController.js';

document.addEventListener('DOMContentLoaded', () => {
  
  if (window.location.hash && window.location.hash !== '#prologue') {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);

  
  const prologueController = new ScrollPrologueController();
  window.__prologueController = prologueController;

 
  const appRootEl = document.getElementById('appRoot');
  if (appRootEl) {
    const root = createRoot(appRootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
