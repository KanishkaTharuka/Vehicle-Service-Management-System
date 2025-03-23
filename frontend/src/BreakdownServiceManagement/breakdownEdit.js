import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './breakdownEdit.css';

const BreakdownEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: '',
    customerName: '',
    customerContactNumber: '',
    vehicleMakeModel: '',
    vehicleType: '',
    currentLocation: { address: '' },
    breakdownType: '',
    emergencyLevel: '',
  });


  // Fetch breakdown data by ID
  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const response = await fetch(`http://localhost:8070/breakdown/get/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data.breakdown);
        } else {
          console.error('Failed to fetch breakdown details');
        }
      } catch (error) {
        console.error('Error fetching breakdown details:', error);
      }
    };

    fetchBreakdown();
  }, [id]);

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
      const response = await fetch(`http://localhost:8070/breakdown/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Breakdown updated successfully!');
        navigate('/breakdown'); // Redirect to the breakdown view page
      } else {
        alert('Failed to update breakdown.');
      }
    } catch (error) {
      console.error('Error updating breakdown:', error);
      alert('An error occurred while updating the breakdown.');
    }
  };

  return (
    <div className="breakdown-edit-container">
      <h1>Edit Breakdown Request</h1>
      <form className="breakdown-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vehicleRegNumber">Vehicle Registration Number</label>
          <input
            type="text"
            id="vehicleRegNumber"
            name="vehicleRegistrationNumber"
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
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerContactNumber">Customer Contact Number</label>
          <input
            type="text"
            id="customerContactNumber"
            name="customerContactNumber"
            value={formData.customerContactNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleMakeModel">Vehicle Make & Model</label>
          <input
            type="text"
            id="vehicleMakeModel"
            name="vehicleMakeModel"
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
            value={formData.currentLocation.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentLocation: { address: e.target.value },
              })
            }
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
          Update Breakdown
        </button>
      </form>
    </div>
  );
};

export default BreakdownEdit;