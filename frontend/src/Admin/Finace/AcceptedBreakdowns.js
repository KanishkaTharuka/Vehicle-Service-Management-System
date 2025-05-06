import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Sidebar from '../AdminDashboard/Sidebar';

const AcceptedBreakdowns = () => {
  const [acceptedBreakdowns, setAcceptedBreakdowns] = useState([]);
  const [filteredBreakdowns, setFilteredBreakdowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate breakdown price
  const calculatePrice = (distance) => {
    if (!distance || isNaN(distance)) return 0;
    const basePrice = 1000;
    const perKmPrice = 100;
    return distance <= 100 ? basePrice : basePrice + (distance - 100) * perKmPrice;
  };

  // Generate PDF bill
  const generateBill = (breakdown) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('AUTOEXPERT (PVT) LTD', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Breakdown Service Bill', 105, 25, { align: 'center' });
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);
    doc.setFontSize(12);
    let yPosition = 45;

    const addDetail = (label, value) => {
      doc.setTextColor(100, 100, 100);
      doc.text(`${label}:`, 20, yPosition);
      doc.setTextColor(40, 40, 40);
      doc.text(String(value || 'N/A'), 70, yPosition);
      yPosition += 8;
    };

    addDetail('Vehicle Type', breakdown.vehicleType);
    addDetail('Registration No', breakdown.vehicleRegistrationNumber);
    addDetail('Location', `${breakdown.currentLocation?.type || 'N/A'}: ${breakdown.currentLocation?.address || 'N/A'}`);
    addDetail('Breakdown Type', breakdown.breakdownType);
    addDetail('Customer', breakdown.customerName);
    addDetail('Contact', breakdown.customerContactNumber);
    addDetail('Distance', `${breakdown.totalDestination || 0} km`);
    addDetail('Service Date', new Date(breakdown.updatedAt).toLocaleString());

    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Service Charges:', 20, yPosition);

    const price = calculatePrice(breakdown.totalDestination);
    const priceDetails =
      breakdown.totalDestination <= 100
        ? `Base charge (up to 100km): LKR 1,000`
        : `Base charge: LKR 1,000 + Additional (${breakdown.totalDestination - 100}km × LKR 100)`;

    yPosition += 10;
    doc.setFontSize(12);
    doc.text(priceDetails, 25, yPosition);

    yPosition += 15;
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 0);
    doc.text(`Total Amount: LKR ${price.toLocaleString()}`, 20, yPosition);

    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing AutoExpert!', 105, yPosition, { align: 'center' });
    doc.text('Contact: 011-1234567 | Email: info@autoexpert.lk', 105, yPosition + 5, { align: 'center' });

    doc.save(`Breakdown-Bill-${breakdown.vehicleRegistrationNumber || 'unknown'}.pdf`);
  };

  // Filter breakdowns based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBreakdowns(acceptedBreakdowns);
    } else {
      const filtered = acceptedBreakdowns.filter((breakdown) =>
        breakdown.vehicleRegistrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBreakdowns(filtered);
    }
  }, [searchTerm, acceptedBreakdowns]);

  // Fetch accepted breakdowns
  useEffect(() => {
    const fetchAcceptedBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8070/finance/accepted');
        if (!response.ok) {
          throw new Error('Failed to fetch accepted breakdown requests');
        }
        const data = await response.json();
        if (!data || !data.breakdowns) {
          throw new Error('Invalid response format');
        }
        setAcceptedBreakdowns(data.breakdowns);
        setFilteredBreakdowns(data.breakdowns);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accepted breakdown requests:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAcceptedBreakdowns();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-gray-600 py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600 py-5">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen pr-10">
      <div className="w-[300px] flex-shrink-0">
                <Sidebar />
            </div>
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/breakdown.jpg')" }}
      ></div>
      {/* Content */}
      <div className="relative">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Accepted Breakdown Requests</h1>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {filteredBreakdowns.length === 0 ? (
          <p className="text-center text-lg text-gray-600 py-5">No matching breakdown requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBreakdowns.map((breakdown) => (
              <div
                key={breakdown._id}
                className="bg-white bg-opacity-95 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
                  <h3 className="text-lg font-semibold">{breakdown.vehicleType}</h3>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded font-bold">
                    {breakdown.vehicleRegistrationNumber}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex mb-3">
                    <span className="font-semibold text-gray-600 w-28">Location:</span>
                    <span className="text-gray-800 flex-1">
                      {breakdown.currentLocation?.type + ': ' + breakdown.currentLocation?.address}
                    </span>
                  </div>
                  <div className="flex mb-3">
                    <span className="font-semibold text-gray-600 w-28">Breakdown Type:</span>
                    <span className="text-gray-800 flex-1">{breakdown.breakdownType}</span>
                  </div>
                  <div className="flex mb-3">
                    <span className="font-semibold text-gray-600 w-28">Distance:</span>
                    <span className="text-gray-800 flex-1">{breakdown.totalDestination} km</span>
                  </div>
                  <div className="flex mb-3">
                    <span className="font-semibold text-gray-600 w-28">Customer:</span>
                    <span className="text-gray-800 flex-1">{breakdown.customerName}</span>
                  </div>
                  <div className="flex mb-3">
                    <span className="font-semibold text-gray-600 w-28">Contact:</span>
                    <span className="text-gray-800 flex-1">{breakdown.customerContactNumber}</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 flex justify-between items-end border-t border-gray-200 relative min-h-[80px] rounded-b-lg">
                  <div className="absolute left-4 bottom-4 flex flex-col">
                    <span className="font-bold text-green-600 text-lg">
                      LKR {calculatePrice(breakdown.totalDestination).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Accepted: {new Date(breakdown.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="absolute right-4 bottom-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                      onClick={() => generateBill(breakdown)}
                    >
                      Generate Bill
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptedBreakdowns;