import React, { useState, useEffect, useRef } from 'react';
import './NookiSearchPopup.css';

const NookiSearchPopup = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [result, setResult] = useState(null);
  const [nookisData, setNookisData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/nookis.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setNookisData(data);
      })
      .catch((error) => console.error('Error fetching nookis data:', error));
  }, []);

  useEffect(() => {
    if (result) {
      const imageUrl = `https://static.unisat.io/content/${result.id}`;
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = canvasRef.current;
        const scaleFactor = 4;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      };

      img.onerror = (err) => {
        console.error('Error loading image:', err);
        alert('Failed to load image.');
      };

      img.src = imageUrl;
    }
  }, [result]);

  const handleSearch = () => {
    const num = searchNumber.trim();
    const item = nookisData.find(
      (nooki) =>
        nooki.meta.name.toLowerCase() === `ordinooki#${num}`.toLowerCase()
    );

    if (item) {
      setResult(item);
    } else {
      setResult(null);
      alert('No matching Ordinooki found.');
    }
  };

  const handleDownload = () => {
    if (result) {
      const canvas = document.createElement('canvas');
      const imageUrl = `https://static.unisat.io/content/${result.id}`;
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
        a.download = `Ordinooki#${searchNumber}_HD.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      img.onerror = (err) => {
        console.error('Error loading image for download:', err);
        alert('Failed to load image for download.');
      };

      img.src = imageUrl;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nooki-popup-overlay">
      <div className="nooki-popup-content">
        <button className="close-button" onClick={() => {
          console.log("Close button clicked");
          onClose();
        }}>
          &times;
        </button>
        <h2>Search Your Nooki</h2>
        <input
          type="number"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          placeholder="Enter Nooki Number"
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
        <button className="download-button" onClick={handleDownload}>Download</button>
        {result && (
          <div className="result">
            <h3>{result.meta.name}</h3>
            <canvas ref={canvasRef} className="upscaled-canvas" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NookiSearchPopup;
