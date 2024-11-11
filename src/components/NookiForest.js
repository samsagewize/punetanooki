// src/components/NookiForest.js
import React from 'react';
import '../App.css';

const NookiForest = () => {
  return (
    <div className="forest-container">
      <header className="header">
        <h1>Nooki Forest</h1>
      </header>
      <main className="forest-content">
        <p>
          Welcome to Nooki Forest, a vast and enchanting virtual world teeming with adventures. Explore diverse landscapes, meet unique characters, and embark on quests that challenge your skills and imagination.
        </p>
        {/* Add more content as needed */}
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Ordinooki. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NookiForest;
