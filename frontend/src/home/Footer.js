import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        <div style={columnStyle}>
          <h3>CITY NETWORK</h3>
          <div style={gridStyle}>
            <div>Colombo</div>
            <div>Galle</div>
            <div>Gampaha</div>
            <div>Kandy</div>
            <div>Badulla</div>
            <div>Kadana</div>
            <div>Matara</div>
            <div>Kalutara</div>
            <div>Panadura</div>
          </div>
        </div>
        <div style={columnStyle}>
          <h3>CITY OFFICE</h3>
          <p>66, Attidiya Road,</p>
          <p>Rathmalana,</p>
          <p>Sri Lanka 10390</p>
        </div>
        <div style={columnStyle}>
          <h3>OPENING HOURS</h3>
          <p>Mon - Fri: 7 AM - 6 PM</p>
          <p>Sat - Sun: 7 AM - 6 PM</p>
        </div>
      </div>

      {/* Social Media Icons */}
      <div style={socialMediaStyle}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
          <FaFacebook style={iconStyle} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
          <FaTwitter style={iconStyle} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
          <FaInstagram style={iconStyle} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}>
          <FaLinkedin style={iconStyle} />
        </a>
      </div>

      <p style={copyrightStyle}>&copy; 2025 AutoService. All rights reserved.</p>
    </footer>
  );
}

const footerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '20px 0',
  textAlign: 'center',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

const contentStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginBottom: '10px',
};

const columnStyle = {
  flex: '1',
  padding: '0 10px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
};

const socialMediaStyle = {
  margin: '10px 0',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
};

const iconLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
};

const iconStyle = {
  fontSize: '24px',
  transition: 'color 0.3s ease',
};

const copyrightStyle = {
  marginTop: '10px',
  fontSize: '0.9em',
};

export default Footer;