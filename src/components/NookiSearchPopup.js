import React, { useState, useEffect, useRef } from 'react';
import './NookiSearchPopup.css';

const NookiSearchPopup = ({ isOpen, onClose }) => {
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Load and upscale the image when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        const scaleFactor = 4; // Upscale factor
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Pixelated effect
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = () => {
        console.error('Error loading image');
        setError('Failed to load the Ordinooki image.');
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Search for Ordinooki by address using the Render backend
  const handleSearch = async () => {
    setError(''); // Clear previous errors
    setImageUrl(''); // Clear previous image
    if (!address.trim()) {
      setError('Please enter an address.');
      return;
    }

    try {
      const response = await fetch(
        `https://whitelist-checker.onrender.com/check-address?address=${encodeURIComponent(address)}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.status === 'success' && data.image) {
        setImageUrl(data.image); // Set the image URL from the backend
      } else {
        setError(data.message || 'No Ordinooki found for this address.');
      }
    } catch (error) {
      console.error('Error fetching Ordinooki:', error);
      setError('Failed to fetch Ordinooki. Please check your address and try again.');
    }
  };

  // Download the upscaled image
  const handleDownload = () => {
    if (imageUrl) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const scaleFactor = 4;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        http://a.download = `Ordinooki_${address.slice(0, 8)}_HD.png`; // Filename with truncated address
        document.body.appendChild(a);
        http://a.click();
        document.body.removeChild(a);
      };
      img.onerror = () => {
        console.error('Error loading image for download');
        setError('Failed to download the Ordinooki image.');
      };
      img.src = imageUrl;
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nooki-popup-overlay">
      <div className="nooki-popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Search Your Ordinooki</h2>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(http://e.target.value)}
          onKeyPress={handleKeyPress} // Search on Enter
          placeholder="Enter your address (e.g., bc1p...)"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={!imageUrl} // Disable if no image
        >
          Download
        </button>
        {error && <p className="error-message">{error}</p>}
        {imageUrl && (
          <div className="result">
            <h3>Ordinooki for {address.slice(0, 8)}...</h3>
            <canvas ref={canvasRef} className="upscaled-canvas" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NookiSearchPopup;
