import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/primitives.css';
import './styles/layout.css';
import './styles/pages.css';
import './styles/apages.css';  // last: themes the whole site when mode === 'apages'
import './styles/portfolio.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
