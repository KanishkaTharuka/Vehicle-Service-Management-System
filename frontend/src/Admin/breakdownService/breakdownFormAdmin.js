import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Sidebar from '../AdminDashboard/Sidebar';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
});

const companyLocation = { lat: 6.918177602655325, lng: 79.97482092571046 };

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getLocationName = async (lat, lon) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    return response.data.display_name || 'Unknown Location';
  } catch (error) {
    console.error('Error fetching location name:', error);
    return 'Unknown Location';
  }
};

const LocationMarker = ({ setFormData }) => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [distance, setDistance] = useState(null);

  useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      const location = await getLocationName(lat, lon);
      setLocationName(location);

      const dist = haversineDistance(companyLocation.lat, companyLocation.lng, lat, lon).toFixed(2);
      setDistance(dist);

      setFormData((prev) => ({
        ...prev,
        currentLocation: location,
        distanceToCompany: dist,
      }));
    },
  });

  return position === null ? null : (
    <>
      <Marker position={position} icon={customIcon} />
      {distance && <p className="text-sm text-textGray m-1">Distance to company: {distance} km</p>}
    </>
  );
};

const BreakdownFormAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: '',
    customerName: '',
    customerContactNumber: '',
    vehicleMakeModel: '',
    vehicleType: '',
    currentLocation: '',
    totalDestination: '',
    breakdownType: '',
    emergencyLevel: '',
    isAccepted: false,
  });

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

      setFormData((prev) => ({
        ...prev,
        [name]: numbersOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      totalDestination: parseFloat(formData.distanceToCompany),
    };

    try {
      const response = await axios.post('http://localhost:8070/breakdown/add', updatedFormData);

      if (response.status === 200 || response.status === 201) {
        alert('Breakdown request submitted successfully!');
        navigate(`/admin/breakdown-form-admin-view`);
        setFormData({
          vehicleRegistrationNumber: '',
          customerName: '',
          customerContactNumber: '',
          vehicleMakeModel: '',
          vehicleType: '',
          currentLocation: '7.011129322315867, 80.10686737002216',
          totalDestination: '',
          breakdownType: '',
          emergencyLevel: '',
          isAccepted: false,
        });
      } else {
        alert(`Error: ${response.data.message || 'Failed to submit request.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-5 bg-customGray overflow-y-auto">
        <button
          className="mb-5 px-4 py-2 bg-customBlue text-white rounded-md hover:bg-customBlue transition-colors"
          onClick={() => navigate('/admin/breakdown-form-admin-view')}
        >
          View All
        </button>
        <div className="max-w-4xl mx-auto my-8 p-5 bg-customGray rounded-xl shadow-2xl font-sans">
          <h2 className="text-center text-textGray mb-6 text-2xl font-semibold">
            BREAKDOWN ASSISTANCE FORM
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
            <div className="mb-4 mr-4">
              <label htmlFor="vehicleRegNumber" className="block text-left mb-2 font-medium text-textGray">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                id="vehicleRegNumber"
                name="vehicleRegistrationNumber"
                placeholder="Enter vehicle registration number"
                value={formData.vehicleRegistrationNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
                required
              />
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="customerName" className="block text-left mb-2 font-medium text-textGray">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                placeholder="Enter your name"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
                required
              />
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="customerContactNumber" className="block text-left mb-2 font-medium text-textGray">
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
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
                required
              />
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="vehicleMakeModel" className="block text-left mb-2 font-medium text-textGray">
                Vehicle Make and Model
              </label>
              <input
                type="text"
                id="vehicleMakeModel"
                name="vehicleMakeModel"
                placeholder="Enter vehicle make and model"
                value={formData.vehicleMakeModel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
                required
              />
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="vehicleType" className="block text-left mb-2 font-medium text-textGray">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
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
            <div className="mb-4 mr-4">
              <label htmlFor="currentLocation" className="block text-left mb-2 font-medium text-textGray">
                Current Location
              </label>
              <input
                type="text"
                id="currentLocation"
                name="currentLocation"
                placeholder="Click on Map to Select Location"
                value={formData.currentLocation}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <MapContainer
                center={[6.9271, 79.8612]}
                zoom={10}
                style={{ height: '300px', width: '100%' }}
                className="rounded-md border border-gray-300"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[companyLocation.lat, companyLocation.lng]} icon={customIcon} />
                <LocationMarker setFormData={setFormData} />
              </MapContainer>
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="totalDestination" className="block text-left mb-2 font-medium text-textGray">
                Total Destination
              </label>
              <input
                type="text"
                id="totalDestination"
                name="distanceToCompany"
                placeholder="Distance to Company (km)"
                value={formData.distanceToCompany}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                required
              />
            </div>
            <div className="mb-4 mr-4">
              <label htmlFor="breakdownType" className="block text-left mb-2 font-medium text-textGray">
                Breakdown Type
              </label>
              <select
                id="breakdownType"
                name="breakdownType"
                value={formData.breakdownType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
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
            <div className="mb-4 mr-4">
              <label htmlFor="emergencyLevel" className="block text-left mb-2 font-medium text-textGray">
                Emergency Level
              </label>
              <select
                id="emergencyLevel"
                name="emergencyLevel"
                value={formData.emergencyLevel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-customBlue focus:ring-2 focus:ring-customBlue/20 transition-colors"
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
              className="col-span-1 md:col-span-2 bg-customBlue text-white py-3 px-5 text-base rounded-md cursor-pointer hover:bg-customBlue transition-colors font-medium mt-3"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BreakdownFormAdmin;