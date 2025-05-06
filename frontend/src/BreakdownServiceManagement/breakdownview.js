import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../home/Header';
import Footer from '../home/Footer';

const BreakdownView = () => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const response = await fetch('http://localhost:8070/breakdown/view');
        if (response.ok) {
          const data = await response.json();
          setBreakdowns(data);
        }
      } catch (error) {
        console.error('Error fetching breakdowns:', error);
      }
    };

    fetchBreakdowns();
  }, []);

  const handleCardClick = (breakdown) => {
    setSelectedBreakdown(breakdown);
  };

  const closePopup = () => {
    setSelectedBreakdown(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/breakdown/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBreakdowns(breakdowns.filter((breakdown) => breakdown._id !== id));
        closePopup();
      }
    } catch (error) {
      console.error('Error deleting breakdown:', error);
    }
  };

  const handleEdit = (breakdown) => {
    navigate(`/breakdownedit/${breakdown._id}`);
  };

  return (
    <div>
      <Header />
      <div className="p-5 font-sans max-w-5xl mx-auto my-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-center text-textGray mb-5 text-2xl font-bold">
          Breakdown Requests
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
          {breakdowns.map((breakdown) => (
            <div
              key={breakdown._id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer relative p-4 ${breakdown.isAccepted ? 'border-l-4 border-customGreen' : ''}`}
              onClick={() => handleCardClick(breakdown)}
            >
              <div className="flex justify-between items-center mb-3 p-3 bg-customBlue text-white rounded-lg">
                <h2 className="text-lg font-semibold text-white m-0">{breakdown.customerName}</h2>
                <span
                  className={`px-3 py-2 rounded-lg text-xs font-bold capitalize ${
                    breakdown.emergencyLevel.toLowerCase() === 'low'
                      ? 'bg-customGreen text-white'
                      : breakdown.emergencyLevel.toLowerCase() === 'medium'
                      ? 'bg-customYellow text-black'
                      : 'bg-customRed text-white'
                  }`}
                >
                  {breakdown.emergencyLevel}
                </span>
              </div>
              <div className="text-textGray p-4">
                <p className="text-sm mb-2">
                  <strong className="text-textGray">Vehicle:</strong> {breakdown.vehicleMakeModel}
                </p>
                <p className="text-sm mb-2">
                  <strong className="text-textGray">Reg No:</strong> {breakdown.vehicleRegistrationNumber}
                </p>
                <p className="text-sm">
                  <strong className="text-textGray">Location:</strong> {breakdown.currentLocation?.address}
                </p>
              </div>
              {breakdown.isAccepted && (
                <div className="absolute bottom-3 right-3 bg-customGreen text-white px-2 py-1 rounded-xl text-xs flex items-center">
                  Accepted
                  {breakdown.selectedDriverName && (
                    <span className="ml-1 text-[0.7rem] opacity-90">
                      • {breakdown.selectedDriverName}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedBreakdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-lg p-5 max-h-[80vh] overflow-y-auto shadow-2xl relative">
              <button
                className="absolute top-3 right-3 bg-transparent border-none text-2xl cursor-pointer text-textGray hover:text-customBlue transition-colors"
                onClick={closePopup}
                aria-label="Close popup"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-textGray mt-0 mb-5">Breakdown Details</h2>
              <div className="mb-5">
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Customer:</span>
                  <span>{selectedBreakdown.customerName}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Contact:</span>
                  <span>{selectedBreakdown.customerContactNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Vehicle:</span>
                  <span>{selectedBreakdown.vehicleMakeModel} ({selectedBreakdown.vehicleType})</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Reg No:</span>
                  <span>{selectedBreakdown.vehicleRegistrationNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Location:</span>
                  <span>{selectedBreakdown.currentLocation?.address}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Issue:</span>
                  <span>{selectedBreakdown.breakdownType}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                  <span className="font-bold w-32 text-textGray">Priority:</span>
                  <span
                    className={`px-3 py-2 rounded-lg text-xs font-bold capitalize ${
                      selectedBreakdown.emergencyLevel.toLowerCase() === 'low'
                        ? 'bg-customGreen text-white'
                        : selectedBreakdown.emergencyLevel.toLowerCase() === 'medium'
                        ? 'bg-customYellow text-black'
                        : 'bg-customRed text-white'
                    }`}
                  >
                    {selectedBreakdown.emergencyLevel}
                  </span>
                </div>
                {selectedBreakdown.isAccepted && (
                  <>
                    <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                      <span className="font-bold w-32 text-textGray">Status:</span>
                      <span className="text-acceptedText font-bold">Accepted</span>
                    </div>
                    {selectedBreakdown.selectedDriverName && (
                      <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                        <span className="font-bold w-32 text-textGray">Driver:</span>
                        <span>{selectedBreakdown.selectedDriverName}</span>
                      </div>
                    )}
                    {selectedBreakdown.acceptedAt && (
                      <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-3 mb-3">
                        <span className="font-bold w-32 text-textGray">Accepted At:</span>
                        <span>{new Date(selectedBreakdown.acceptedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                {!selectedBreakdown.isAccepted ? (
                  <>
                    <button
                      className="bg-customBlue text-white px-4 py-2 rounded-md font-bold hover:bg-customBlue transition-colors"
                      onClick={() => handleEdit(selectedBreakdown)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-customRed text-white px-4 py-2 rounded-md font-bold hover:bg-customRed transition-colors"
                      onClick={() => handleDelete(selectedBreakdown._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <p className="text-center text-textGray italic p-3 bg-customGray rounded-md w-full">
                    This request has been processed and cannot be modified
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BreakdownView;