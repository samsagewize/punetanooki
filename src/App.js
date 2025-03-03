// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import NookiSearchPopup from './components/NookiSearchPopup';
import nookiBanner from './assets/images/nooki_banner_112.png';
import React from "react";
import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}


function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openNookiSearchPopup = () => {
    setIsPopupOpen(true);
  };

  const closeNookiSearchPopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="banner-container">
          <img src={nookiBanner} alt="Nooki Banner" className="banner-image" />
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home openNookiSearchPopup={openNookiSearchPopup} />} />
          <Route path="/about" element={<About />} />
          {/* Remove or adjust the route for Nooki Forest if it's not needed */}
        </Routes>

        {/* Include the popup component */}
        <NookiSearchPopup isOpen={isPopupOpen} onClose={closeNookiSearchPopup} />
      </div>
    </Router>
  );
}

export default App;
