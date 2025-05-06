import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customerContactNumber') {
      const numbersOnly = value.replace(/[^0-9]/g, '');

      if (numbersOnly.length > 0 && numbersOnly[0] !== '0') {
        return;
      }

      if (numbersOnly.length > 10) {
        return;
      }

      setFormData({
        ...formData,
        [name]: numbersOnly,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

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
        navigate('/breakdown');
      } else {
        alert('Failed to update breakdown.');
      }
    } catch (error) {
      console.error('Error updating breakdown:', error);
      alert('An error occurred while updating the breakdown.');
    }
  };

  return (
    <div className="p-5 font-sans max-w-xl mx-auto bg-customGray rounded-xl shadow-lg">
      <h1 className="text-center text-textGray mb-5 text-2xl font-bold">
        Edit Breakdown Request
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="vehicleRegNumber" className="font-bold text-textGray">
            Vehicle Registration Number
          </label>
          <input
            type="text"
            id="vehicleRegNumber"
            name="vehicleRegistrationNumber"
            value={formData.vehicleRegistrationNumber}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="customerName" className="font-bold text-textGray">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="customerContactNumber" className="font-bold text-textGray">
            Customer Contact Number
          </label>
          <input
            type="text"
            id="customerContactNumber"
            name="customerContactNumber"
            placeholder="Enter your contact number (e.g., 0771234567)"
            value={formData.customerContactNumber}
            onChange={handleInputChange}
            maxLength="10"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number starting with 0"
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
          <small className="text-textGray text-xs">
            Must be 10 digits starting with 0 (e.g., 0771234567)
          </small>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="vehicleMakeModel" className="font-bold text-textGray">
            Vehicle Make & Model
          </label>
          <input
            type="text"
            id="vehicleMakeModel"
            name="vehicleMakeModel"
            value={formData.vehicleMakeModel}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="vehicleType" className="font-bold text-textGray">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          >
            <option value="" disabled>
              Select vehicle type
            </option>
            <option value="Car">Car</option>
            <option value="Truck">Truck</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="currentLocation" className="font-bold text-textGray">
            Current Location
          </label>
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
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="totalDestination" className="font-bold text-textGray">
            Total Destination
          </label>
          <input
            type="text"
            id="totalDestination"
            name="totalDestination"
            value={formData.totalDestination}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="breakdownType" className="font-bold text-textGray">
            Breakdown Type
          </label>
          <select
            id="breakdownType"
            name="breakdownType"
            value={formData.breakdownType}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          >
            <option value="" disabled>
              Select breakdown type
            </option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="Flat Tire">Flat Tire</option>
            <option value="Fuel Issue">Fuel Issue</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="emergencyLevel" className="font-bold text-textGray">
            Emergency Level
          </label>
          <select
            id="emergencyLevel"
            name="emergencyLevel"
            value={formData.emergencyLevel}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-customBlue"
            required
          >
            <option value="" disabled>
              Select emergency level
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="p-3 border-none rounded-md bg-customBlue text-white text-base cursor-pointer hover:bg-customBlue transition-colors"
        >
          Update Breakdown
        </button>
      </form>
    </div>
  );
};

export default BreakdownEdit;