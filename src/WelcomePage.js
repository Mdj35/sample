import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      // Redirect after animation
      window.location.href = '/login';
    }, 500); // Duration of fade-out animation
  };

  return (
    <div className={`welcome-container ${isClicked ? 'fade-out' : ''} ${isMounted ? 'fade-in' : ''}`}>
      <div className="image-container"></div>
      <div className="welcome-message-container">
        <div className={`welcome-message ${isClicked ? 'fade-out' : ''}`}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s" alt="Glamour Salon Logo" className="logo" />
          <header className="welcome-header">
            <h1>Welcome to Chic Station</h1>
            <p>Book your appointment with ease and style.</p>
            <button
              className={`book-now-button ${isClicked ? 'fade-out' : ''}`}
              onClick={handleClick}
            >
              Book Now
            </button>
          </header>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
