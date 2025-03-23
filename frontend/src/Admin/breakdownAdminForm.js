import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './breakdownAdminForm.css';

const BreakdownHome = () => {
  const [view, setView] = useState('allDetails');
  const [breakdowns, setBreakdowns] = useState([]);
  const [formData, setFormData] = useState({
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
  const navigate = useNavigate();

  // Fetch all breakdowns
  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8070/breakdown/view');
        const data = await response.json();
        console.log('Fetched breakdowns:', data); // Debugging
        setBreakdowns(data);
      } catch (error) {
        console.error('Error fetching breakdowns:', error);
      }
    };

    fetchBreakdowns();
  }, []);

  const handleContactClick = () => {
    setView('allDetails');
  };

  const handleFormClick = () => {
    setView('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
        
        // Fetch the updated list of breakdowns
        const updatedResponse = await fetch('http://localhost:8070/breakdown/view');
        const updatedData = await updatedResponse.json();
        
        // Update the breakdowns state with the new data
        setBreakdowns(updatedData);

        // Reset the form data
        setFormData({
          vehicleRegistrationNumber: '',
          customerName: '',
          customerContactNumber: '',
          vehicleMakeModel: '',
          vehicleType: '',
          currentLocation: '',
          breakdownType: '',
          emergencyLevel: '',
        });

        // Navigate to the allDetails section
        setView('allDetails');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Handle accepting a breakdown request
  const handleAcceptRequest = async (breakdownId) => {
    if (window.confirm('Are you sure you want to accept this request?')) {
      try {
        const response = await fetch(`http://localhost:8070/breakdown/accept/${breakdownId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Request accepted successfully!');
          // Update the breakdowns state to reflect the accepted request
          const updatedBreakdowns = breakdowns.map(b => 
            b._id === breakdownId ? { ...b, isAccepted: true, acceptedAt: new Date() } : b
          );
          setBreakdowns(updatedBreakdowns);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error accepting request:', error);
        alert('An error occurred while accepting the request.');
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <button
          className={`nav-button ${view === 'allDetails' ? 'active' : ''}`}
          onClick={handleContactClick}
        >
          Breakdown All details
        </button>
        <button
          className={`nav-button ${view === 'form' ? 'active' : ''}`}
          onClick={handleFormClick}
        >
          Breakdown Form
        </button>
      </div>

      <div className="modal-content">
        {view === 'allDetails' ? (
          <>
            <h1>Breakdown Requests</h1>
            <div className="breakdown-list">
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Vehicle Reg. No</th>
                    <th>Customer Name</th>
                    <th>Contact Number</th>
                    <th>Vehicle Type</th>
                    <th>Location</th>
                    <th>Breakdown Type</th>
                    <th>Emergency Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdowns.map((breakdown) => (
                    <tr key={breakdown._id}>
                      <td>{breakdown.vehicleRegistrationNumber}</td>
                      <td>{breakdown.customerName}</td>
                      <td>{breakdown.customerContactNumber}</td>
                      <td>{breakdown.vehicleType}</td>
                      <td>{breakdown.currentLocation.address}</td>
                      <td>{breakdown.breakdownType}</td>
                      <td>{breakdown.emergencyLevel}</td>
                      <td>
                        {!breakdown.isAccepted ? (
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => navigate(`/breakdownedit/${breakdown._id}`)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this request?')) {
                                  try {
                                    await fetch(`http://localhost:8070/breakdown/delete/${breakdown._id}`, {
                                      method: 'DELETE'
                                    });
                                    setBreakdowns(breakdowns.filter(b => b._id !== breakdown._id));
                                  } catch (error) {
                                    console.error('Error deleting breakdown:', error);
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                            <button 
                              className="accept-btn"
                              onClick={() => handleAcceptRequest(breakdown._id)}
                            >
                              Accept
                            </button>
                          </div>
                        ) : (
                          <span className="accepted-text">Accepted on</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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