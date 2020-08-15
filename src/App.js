import React, { useState, useEffect } from 'react';
import './App.css';

import Buttons from './Buttons';
import RequestQueue from './RequestQueue';

function App() {

  const [network, setNetwork] = useState(navigator.onLine);

  useEffect(() => {
    let interval = setInterval(() => {
      setNetwork(navigator.onLine);
    }, 1000);

    return () => { clearInterval(interval) }
  }, [])


  return (
    <div className="app">
      <header className="app_header">
        <h2>Pixel Tracking</h2>
      </header>
      <div className={`app_network ${network ? 'online' : 'offline'}`}>
        You are {network ? 'online' : 'Offline'}
      </div>
      <div className="app_body">
        <div className="app_buttons card">
          <Buttons />
        </div>
        <div className="app_requestQueue card">
          <RequestQueue />
        </div>
      </div>

    </div>
  );
}

export default App;
