import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { FaClock, FaHome, FaLocationArrow, FaMobile, FaMotorcycle, FaWhatsapp } from 'react-icons/fa';
import Header from '../home/Header';
import Footer from '../home/Footer';

// Leaflet custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
});

const companyLocation = { lat: 6.918177602655325, lng: 79.97482092571046 }; // Set company location

// Distance Calculation
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Convert Coordinates to Location Name
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

      // Get Location Name
      const location = await getLocationName(lat, lon);
      setLocationName(location);

      // Calculate Distance
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
      {distance && <p className="text-gray-700">Distance to company: {distance} km</p>}
    </>
  );
};

const BreakdownHome = () => {
  const [view, setView] = useState('contact');
  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: '',
    customerName: '',
    vehicleMakeModel: '',
    vehicleType: '',
    currentLocation: '',
    totalDestination: `${companyLocation.lat}, ${companyLocation.lng}`,
    breakdownType: '',
    emergencyLevel: '',
    isAccepted: false,
  });
  const navigate = useNavigate();

  const handleContactClick = () => {
    setView('contact');
  };

  const handleFormClick = () => {
    setView('form');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Contact number validation
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // totalDestination stores km
    const updatedFormData = {
      ...formData,
      totalDestination: parseFloat(formData.distanceToCompany),
    };

    console.log('Updated Form Data:', updatedFormData);

    try {
      const response = await axios.post('http://localhost:8070/breakdown/add', updatedFormData);

      console.log('Response received:', response);

      if (response.status === 200 || response.status === 201) {
        alert('Breakdown request submitted successfully!');
        navigate('/breakdown');

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
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-5 font-sans">
        <div className="flex justify-center gap-2 mb-10">
          <button
            className={`px-5 py-2 text-base border rounded-md transition-colors ${
              view === 'contact'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={handleContactClick}
          >
            Breakdown Contact
          </button>
          <button
            className={`px-5 py-2 text-base border rounded-md transition-colors ${
              view === 'form'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={handleFormClick}
          >
            Breakdown Form
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          {view === 'contact' ? (
            <>
              <h2 className="text-lg font-bold uppercase mb-5">
                If you've broken down, there are two ways you can get in touch.
              </h2>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-2">1. Use our free app</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-2">
                      <a href="https://www.apple.com/" target="_blank" rel="noopener noreferrer">
                        <img
                          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                          alt="Download on the App Store"
                          className="w-24 h-8"
                        />
                      </a>
                      <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                          alt="Get it on Google Play"
                          className="w-24 h-8"
                        />
                      </a>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-2">
                    Our app can use your phone's GPS to pinpoint your location, making it a quick way to get
                    our help.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    You can even track your technician as they travel to you.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    Once you've linked your policy to your app, you can use it to get our help in just a few
                    taps.
                  </p>
                  <p className="text-xs text-gray-600">
                    Please note, our app is not available for Excess and Fleet policies, or for vehicles
                    registered in the Isle of Man.
                  </p>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold mb-2">2. CALL US</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Give us a call and we'll be happy to help (even if you haven't got cover with us).
                  </p>
                  <div className="mb-2">
                    <h5 className="mb-2">Call</h5>
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <FaMobile className="text-xl" />
                      <span>077 539 7531</span>
                    </div>
                    <h5 className="mb-2 mt-2">Whatsapp</h5>
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <FaWhatsapp className="text-xl" />
                      <span>077 539 7531</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-2">Do you have difficulty hearing?</p>
                  <p className="text-sm leading-relaxed mb-2">
                    You can text the word 'RESCUE' and a message explaining what's happened to 61009.
                  </p>
                  <p className="text-xs text-gray-600">
                    Texts may be chargeable, please check with your network provider.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                BREAKDOWN ASSISTANCE FORM
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="vehicleRegNumber" className="block mb-2 font-medium text-gray-700">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    id="vehicleRegNumber"
                    name="vehicleRegistrationNumber"
                    placeholder="Enter vehicle registration number"
                    value={formData.vehicleRegistrationNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="customerName" className="block mb-2 font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    placeholder="Enter your name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="customerContactNumber" className="block mb-2 font-medium text-gray-700">
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
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="vehicleMakeModel" className="block mb-2 font-medium text-gray-700">
                    Vehicle Make and Model
                  </label>
                  <input
                    type="text"
                    id="vehicleMakeModel"
                    name="vehicleMakeModel"
                    placeholder="Enter vehicle make and model"
                    value={formData.vehicleMakeModel}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="vehicleType" className="block mb-2 font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
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
                <br></br>
                <div className="mb-4 md:col-span-2">
                  <label htmlFor="currentLocation" className="block mb-2 font-medium text-gray-700">
                    Current Location
                  </label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    placeholder="Click on Map to Select Location"
                    value={formData.currentLocation}
                    readOnly
                    className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <MapContainer
                    center={[6.9271, 79.8612]}
                    zoom={10}
                    style={{ height: '300px', width: '100%' }}
                    className="rounded-md border border-gray-200"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[companyLocation.lat, companyLocation.lng]} icon={customIcon} />
                    <LocationMarker setFormData={setFormData} />
                  </MapContainer>
                </div>
                <div className="mb-4">
                  <label htmlFor="totalDestination" className="block mb-2 font-medium text-gray-700">
                    Total Destination
                  </label>
                  <input
                    type="text"
                    id="totalDestination"
                    name="distanceToCompany"
                    placeholder="Distance to Company (km)"
                    value={formData.distanceToCompany}
                    readOnly
                    className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
                    required
                  />
                </div>
                <br></br>
                <div className="mb-4">
                  <label htmlFor="breakdownType" className="block mb-2 font-medium text-gray-700">
                    Breakdown Type
                  </label>
                  <select
                    id="breakdownType"
                    name="breakdownType"
                    value={formData.breakdownType}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
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
                <div className="mb-4">
                  <label htmlFor="emergencyLevel" className="block mb-2 font-medium text-gray-700">
                    Emergency Level
                  </label>
                  <select
                    id="emergencyLevel"
                    name="emergencyLevel"
                    value={formData.emergencyLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
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
                  className="col-span-1 md:col-span-2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                >
                  Submit Request
                </button>
              </form>
            </>
          )}
        </div>

        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            What's included with your breakdown cover?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Depending on which vehicle breakdown cover level you choose, you could get:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
              <FaClock className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 roadside assistance</h3>
              <p className="text-gray-600">
                Our breakdown bread and butter. If you break down over a 1/4 of a mile from home, you'll
                get expert roadside help or a tow to a local garage.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
              <FaLocationArrow className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">National vehicle recovery</h3>
              <p className="text-gray-600">
                If your vehicle can't be fixed locally, we can take you, your motor, and any passengers to
                a single destination you choose in the SL.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
              <FaHome className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover at home</h3>
              <p className="text-gray-600">
                They say home is where the heart is. It can also be where a technician is (if your vehicle
                conks out at your home and you need our help).
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
              <FaMotorcycle className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover for different vehicles</h3>
              <p className="text-gray-600">
                Whether it's motorbike breakdown cover or car recovery that you're looking for, you should
                be able to find the right breakdown and recovery services for you.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">What is a vehicle breakdown?</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <img
                src="/images/breakdown2.jpg"
                alt="Vehicle Breakdown"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-600 mb-4">
                A vehicle breakdown is when you can't drive your vehicle because of a mechanical or
                electrical failure, fire, theft or attempted theft, or malicious damage. A breakdown also
                includes flat tyres, running out of fuel, a flat battery, or losing or breaking your
                vehicle keys.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                You can also call us out if your vehicle becomes stuck in water, snow, sand or mud, or if
                something in your vehicle stops working that makes it illegal or dangerous to drive. For
                example, if your windscreen wipers stop working when it's raining, or your headlamps don't
                work and it's dark.
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BreakdownHome;