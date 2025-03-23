import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './breakdownHome.css';

const BreakdownHome = () => {
  const [view, setView] = useState('contact');
  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: '',
    customerName: '',
    vehicleMakeModel: '',
    vehicleType: '',
    currentLocation: '',
    breakdownType: '',
    emergencyLevel: '',
    isAccepted: false,
  });
  const navigate = useNavigate();
  // Handle button clicks
  const handleContactClick = () => {
    setView('contact');
  };

  const handleFormClick = () => {
    setView('form');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8070/breakdown/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Breakdown request submitted successfully!');
        setFormData({
          vehicleRegistrationNumber: '',
          customerName: '',
          customerContactNumber: '',
          vehicleMakeModel: '',
          vehicleType: '',
          currentLocation: '',
          breakdownType: '',
          emergencyLevel: '',
          isAccepted: false,
        });

        navigate('/breakdown');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="modal">
      {/* Header with buttons */}
      <div className="modal-header">
        <button
          className={`nav-button ${view === 'contact' ? 'active' : ''}`}
          onClick={handleContactClick}
        >
          Breakdown Contact
        </button>
        <button
          className={`nav-button ${view === 'form' ? 'active' : ''}`}
          onClick={handleFormClick}
        >
          Breakdown Form
        </button>
      </div>

      {/* Main content */}
      <div className="modal-content">
        {view === 'contact' ? (
          <>
            <h2>If you’ve broken down, there are two ways you can get in touch.</h2>
            <div className="options-container">
              {/* Option 1: Use the app */}
              <div className="option">
                <h3>1. Use our free app</h3>
                <div className="app-section">
                  <img src="path-to-sos-icon.png" alt="SOS Icon" className="sos-icon" />
                  <div className="app-buttons">
                    <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                      <img src="path-to-app-store.png" alt="App Store" className="store-button" />
                    </a>
                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                      <img src="path-to-google-play.png" alt="Google Play" className="store-button" />
                    </a>
                  </div>
                </div>
                <p>Our app can use your phone's GPS to pinpoint your location, making it a quick way to get our help.</p>
                <p>You can even track your technician as they travel to you.</p>
                <p>Once you've linked your policy to your app, you can use it to get our help in just a few taps.</p>
                <p className="note">
                  Please note, our app is not available for Excess and Fleet policies, or for vehicles registered in the Isle of Man.
                </p>
              </div>

              {/* Option 2: Call us */}
              <div className="option">
                <h3>2. CALL US</h3>
                <p>Give us a call and we'll be happy to help (even if you haven't got cover with us).</p>
                <div className="phone-section">
                  <h5>Call</h5>
                  <div className="phone-number">
                    <span className="phone-icon">📞</span>
                    <span>0800 400 600</span>
                  </div>
                  <h5>Whatsapp</h5>
                  <div className="phone-number">
                    <span className="phone-icon">📞</span>
                    <span>+44 141 349 0516</span>
                  </div>
                </div>
                <p>Do you have difficulty hearing?</p>
                <p>You can text the word 'RESCUE' and a message explaining what's happened to 61009.</p>
                <p className="note">Texts may be chargeable, please check with your network provider.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="breakdown-form-heading">BREAKDOWN ASSISTANCE FORM</h2>
            <form className="breakdown-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="vehicleRegNumber">Vehicle Registration Number</label>
                <input
                  type="text"
                  id="vehicleRegNumber"
                  name="vehicleRegistrationNumber"
                  placeholder="Enter vehicle registration number"
                  value={formData.vehicleRegistrationNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  placeholder="Enter your name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerContactNumber">Customer contact number</label>
                <input
                  type="text"
                  id="customerContactNumber"
                  name="customerContactNumber"
                  placeholder="Enter your contact number"
                  value={formData.customerContactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleMakeModel">Vehicle Make and Model</label>
                <input
                  type="text"
                  id="vehicleMakeModel"
                  name="vehicleMakeModel"
                  placeholder="Enter vehicle make and model"
                  value={formData.vehicleMakeModel}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select vehicle type</option>
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="currentLocation">Current Location</label>
                <input
                  type="text"
                  id="currentLocation"
                  name="currentLocation"
                  placeholder="Enter your current location"
                  value={formData.currentLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="breakdownType">Breakdown Type</label>
                <select
                  id="breakdownType"
                  name="breakdownType"
                  value={formData.breakdownType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select breakdown type</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Flat Tire">Flat Tire</option>
                  <option value="Fuel Issue">Fuel Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="emergencyLevel">Emergency Level</label>
                <select
                  id="emergencyLevel"
                  name="emergencyLevel"
                  value={formData.emergencyLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select emergency level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BreakdownHome;