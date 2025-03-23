import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './breakdownView.css';

const BreakdownView = () => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch breakdown data from the backend
  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8070/breakdown/view');
        if (response.ok) {
          const data = await response.json();
          setBreakdowns(data);
        } else {
          console.error('Failed to fetch breakdowns');
        }
      } catch (error) {
        console.error('Error fetching breakdowns:', error);
      }
    };

    fetchBreakdowns();
  }, []);

  // Handle card click to show popup
  const handleCardClick = (breakdown) => {
    setSelectedBreakdown(breakdown);
  };

  // Close popup
  const closePopup = () => {
    setSelectedBreakdown(null);
  };

  // Handle delete breakdown
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/breakdown/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Breakdown deleted successfully!');
        setBreakdowns(breakdowns.filter((breakdown) => breakdown._id !== id));
        closePopup();
      } else {
        alert('Failed to delete breakdown.');
      }
    } catch (error) {
      console.error('Error deleting breakdown:', error);
      alert('An error occurred while deleting the breakdown.');
    }
  };

  // Handle edit breakdown
  const handleEdit = (breakdown) => {
    navigate(`/breakdownedit/${breakdown._id}`); // Navigate to the edit page
  };

  return (
    <div className="breakdown-view-container">
      <h1>Breakdown Requests</h1>
      <div className="card-container">
        {breakdowns.map((breakdown, index) => (
          <div
            key={index}
            className="breakdown-card"
            onClick={() => handleCardClick(breakdown)}
          >
            <div className="card-header">
              <h2>{breakdown.customerName}</h2>
              <span className={`emergency-level ${breakdown.emergencyLevel.toLowerCase()}`}>
                {breakdown.emergencyLevel}
              </span>
            </div>
            <div className="card-body">
              <p><strong>Vehicle Type:</strong> {breakdown.vehicleType}</p>
              <p><strong>Current Location:</strong> {breakdown.currentLocation.address}</p>
              <p><strong>Breakdown Type:</strong> {breakdown.breakdownType}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for detailed view */}
      {selectedBreakdown && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>×</button>
            <h2>Breakdown Details</h2>
            <div className="popup-body">
              <p><strong>Customer Name:</strong> {selectedBreakdown.customerName}</p>
              <p><strong>Vehicle Registration:</strong> {selectedBreakdown.vehicleRegistrationNumber}</p>
              <p><strong>Contact Number:</strong> {selectedBreakdown.customerContactNumber}</p>
              <p><strong>Vehicle Make & Model:</strong> {selectedBreakdown.vehicleMakeModel}</p>
              <p><strong>Vehicle Type:</strong> {selectedBreakdown.vehicleType}</p>
              <p><strong>Current Location:</strong> {selectedBreakdown.currentLocation.address}</p>
              <p><strong>Breakdown Type:</strong> {selectedBreakdown.breakdownType}</p>
              <p><strong>Emergency Level:</strong> 
                <span className={`emergency-level ${selectedBreakdown.emergencyLevel.toLowerCase()}`}>
                  {selectedBreakdown.emergencyLevel}
                </span>
              </p>
            </div>
            <div className="popup-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(selectedBreakdown)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(selectedBreakdown._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownView;