// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation';
import './Header.css';

const Header = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirmation(true);
  };

  const handleClose = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s" alt="Logo" className="logo" />
        
      </div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/userpage">Home</Link></li>
          <li><Link to="/reservations">Reservations</Link></li>
          <li><Link to="/profilepage">Profile</Link></li>
          <li><a href="#" onClick={handleLogoutClick}>Logout</a></li>
        </ul>
      </nav>
      <LogoutConfirmation show={showLogoutConfirmation} onClose={handleClose} />
    </header>
  );
};

export default Header;
