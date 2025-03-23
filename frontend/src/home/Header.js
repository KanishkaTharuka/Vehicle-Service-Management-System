// Navbar.js
import React from 'react';

function Navbar() {
  return (
    <nav style={navStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}><a href="#home" style={linkStyle}>Home</a></li>
        <li style={navItemStyle}><a href="#services" style={linkStyle}>Services</a></li>
        <li style={navItemStyle}><a href="#about" style={linkStyle}>About</a></li>
        <li style={navItemStyle}><a href="#contact" style={linkStyle}>Branches</a></li>
        <li style={navItemStyle}><a href="#contact" style={linkStyle}>Packages</a></li>
        <li style={navItemStyle}><a href="#contact" style={linkStyle}>news</a></li>
        
      </ul>
      <button style={bookingButtonStyle}>Booking</button>
    </nav>
  );
}

const navStyle = {
  backgroundColor: '#333',
  padding: '10px 20px',
};

const navListStyle = {
  display: 'flex',
  listStyleType: 'none',
  justifyContent: 'center',
  padding: '0',
};

const navItemStyle = {
  margin: '0 15px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '18px',
};

const bookingButtonStyle = {
  backgroundColor: '#fff',
  color: '#333',
  border: 'none',
  padding: '10px 20px',
};
export default Navbar;
