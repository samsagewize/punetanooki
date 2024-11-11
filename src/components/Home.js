// src/components/Home.js
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { Howl } from 'howler';
import harmonySound from '../assets/sounds/harmony.mp3';
import nookisImage from '../assets/memes/nookis.png';
import nookisImageGif from '../assets/memes/nookis2.gif'; // Import the GIF image

const Home = ({ openNookiSearchPopup }) => {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(nookisImageGif); // State to handle image transition

  useEffect(() => {
    soundRef.current = new Howl({
      src: [harmonySound],
      loop: true,
      volume: 0.5,
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onplayerror: (id, error) => {
        console.error('Playback error:', error);
        soundRef.current.once('unlock', () => soundRef.current.play());
      },
      onloaderror: (id, error) => console.error('Load error:', error),
    });

    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []);

  const toggleSound = () => {
    if (soundRef.current.playing()) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) setIsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Update useEffect for repeating GIF display
  useEffect(() => {
    const switchImage = () => {
      setCurrentImage(nookisImageGif); // Show GIF first

      // Set a timer to switch back to PNG after the GIF duration
      setTimeout(() => {
        setCurrentImage(nookisImage); // Switch to PNG
      }, 6900); // Adjust the duration to match GIF length (in ms)
    };

    // Initial display of GIF and switch to PNG
    switchImage();

    // Set interval for repeating the GIF display every 10 seconds (adjust as needed)
    const intervalId = setInterval(switchImage, 10000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const gifPaths = [
    '/assets/memes/1.gif', '/assets/memes/2.gif', '/assets/memes/3.gif', 
    '/assets/memes/4.gif', '/assets/memes/5.gif', '/assets/memes/6.gif', 
    '/assets/memes/7.gif', '/assets/memes/8.gif', '/assets/memes/9.gif',
    '/assets/memes/10.gif', '/assets/memes/11.gif', '/assets/memes/12.gif',
    '/assets/memes/13.gif', '/assets/memes/14.gif', '/assets/memes/15.gif', 
    '/assets/memes/16.gif', '/assets/memes/17.gif', '/assets/memes/18.gif',
    '/assets/memes/19.gif', '/assets/memes/21.gif', '/assets/memes/22.gif', 
    '/assets/memes/23.gif', '/assets/memes/24.gif', '/assets/memes/9.png',
    '/assets/memes/20.png'
  ];

  return (
    <div className="home-container">
      {/* GIF Background */}
      <div className="background-gifs">
        {gifPaths.map((gif, index) => (
          <img key={index} src={gif} alt={`background-gif-${index}`} />
        ))}
      </div>

      {/* Header Section */}
      <header className="header">
        <h1>Ordinooki</h1>
      </header>

      {/* Navigation with Dropdown Menu */}
      <nav className="nav">
        <div className="dropdown">
          <button className="dropbtn" onClick={toggleDropdown}>
            ☰ Menu
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/about">About</Link>
              <button
                onClick={() => {
                  toggleDropdown();
                  openNookiSearchPopup();
                }}
              >
                Nooki Forest
              </button>
              <a
                href="https://nookibattle-2c8c0a0bd13c.herokuapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Playground (BETA)
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Sound Toggle Button */}
      <div className="sound-controls">
        <button className="sound-toggle animate-glow" onClick={toggleSound}>
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Main Content Containers */}
      <main className="main-content">
        {/* Hero Section with Background Image */}
        <section className="hero-section">
          <div className="hero-image-container">
            <div
              className={`hero-image ${currentImage === nookisImageGif ? 'visible' : ''}`}
              style={{ backgroundImage: `url(${nookisImageGif})` }}
            ></div>
            <div
              className={`hero-image ${currentImage === nookisImage ? 'visible' : ''}`}
              style={{ backgroundImage: `url(${nookisImage})` }}
            ></div>
          </div>
          <h2>Welcome to Ordinooki</h2>
          <p>
            Embark on an epic journey into the future of blockchain gaming and immersive adventures!
          </p>
          <a
            href="https://magiceden.us/ordinals/marketplace/ordinookis"
            className="explore-button animate-glow"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Now
          </a>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <Link to="/about" className="feature-card animate-glow">
            <img src="/assets/memes/24.gif" alt="About" />
            <h3>About</h3>
            <p>
              Learn more about the Ordinooki lore and the team behind the magic.
            </p>
          </Link>

          <a
            href="https://discord.com/invite/NcjVSUJT4J"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card animate-glow"
          >
            <img src="/assets/memes/23.gif" alt="Discord" />
            <h3>Discord</h3>
            <p>
              Join our alpha channel and connect with fellow adventurers!
            </p>
          </a>

          <div className="feature-card animate-glow">
            <img src="/assets/memes/4.gif" alt="Inquiries" />
            <h3>Inquiries</h3>
            <p>ordinookis@gmail.com</p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <h2>Find us on 𝕏</h2>
          <a
            href="https://twitter.com/YourTwitterHandle" 
            className="signup-button animate-glow"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Ordinooki. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
