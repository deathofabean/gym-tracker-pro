import React from 'react';
import ReactDOM from 'react-dom/client';
import GetPhockingRipped from './get-phocking-ripped';  // ← This line is critical!
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GetPhockingRipped />
  </React.StrictMode>,
);
