import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../AdminDashboard/Sidebar';

const BreakdownFormAdminView = () => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBreakdowns, setFilteredBreakdowns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBreakdowns();
  }, []);

  useEffect(() => {
    const results = breakdowns.filter((breakdown) =>
      breakdown.vehicleRegistrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBreakdowns(results);
  }, [searchTerm, breakdowns]);

  const fetchBreakdowns = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8070/breakdown/view');
      setBreakdowns(response.data);
      setFilteredBreakdowns(response.data);
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverSelection = (e, breakdownId) => {
    const selectedDriverName = e.target.value;
    setBreakdowns(breakdowns.map((b) =>
      b._id === breakdownId ? { ...b, selectedDriverName } : b
    ));
  };

  const handleAcceptRequest = async (breakdownId, customerNumber) => {
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
          const updatedBreakdowns = breakdowns.map((b) =>
            b._id === breakdownId ? { ...b, isAccepted: true, acceptedAt: new Date() } : b
          );
          setBreakdowns(updatedBreakdowns);

          // Send WhatsApp message to customer
          const companyNumber = '+94775397531';
          const message = `Your breakdown request with ID ${breakdownId} has been accepted. Please contact us at ${companyNumber} for further assistance.`;
          const whatsappUrl = `https://web.whatsapp.com/send?phone=${customerNumber}&text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
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

  const handleDelete = async (breakdownId) => {
    if (window.confirm('Are you sure you want to delete this breakdown request?')) {
      try {
        await axios.delete(`http://localhost:8070/breakdown/delete/${breakdownId}`);
        fetchBreakdowns();
      } catch (error) {
        console.error('Error deleting breakdown:', error);
      }
    }
  };

  // const handleSendReport = async (breakdownId) => {
  //   const phoneNumber = "0774630980"
  //   const message = `Your breakdown request with ID ${breakdownId} has been accepted.`;
  //   const whatsappUrl = `http://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`; 

  //   //open the whatsapp chat in new window
  //   window.open(whatsappUrl,"_blank");
  // }

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage('/logo.png', 'PNG', logoX, 10, logoWidth, logoHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('AUTOEXPERT (PVT) LTD', centerX, 45, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('BREAKDOWN REQUESTS REPORT', centerX, 55, { align: 'center' });

    const headers = [
      'Reg No',
      'Customer',
      'Contact',
      'Vehicle Type',
      'Location',
      'Distance (km)',
      'Breakdown Type',
      'Emergency Level',
      'Status',
      'Driver',
    ];

    const tableData = filteredBreakdowns.map((breakdown) => [
      breakdown.vehicleRegistrationNumber,
      breakdown.customerName,
      breakdown.customerContactNumber,
      breakdown.vehicleType,
      breakdown.currentLocation.type === 'Address'
        ? breakdown.currentLocation.address
        : `${breakdown.currentLocation.coordinates[0]}, ${breakdown.currentLocation.coordinates[1]}`,
      breakdown.totalDestination,
      breakdown.breakdownType,
      breakdown.emergencyLevel,
      breakdown.isAccepted ? 'Accepted' : 'Pending',
      breakdown.selectedDriverName || 'Not assigned',
    ]);

    const tableWidth = pageWidth - 40;
    const startX = (pageWidth - tableWidth) / 2;

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 60,
      margin: { left: startX, right: startX },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [0, 123, 255], // Use customBlue
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        textColor: [102, 102, 102], // Use textGray
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 35 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 50 },
        5: { cellWidth: 15 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
        8: { cellWidth: 15 },
        9: { cellWidth: 30 },
      },
    });

    const dateText = `Generated on: ${new Date().toLocaleString()}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(dateText, pageWidth - 10, pageHeight - 10, { align: 'right' });

    doc.save(`breakdown-requests-${new Date().toISOString().slice(0, 10)}.pdf`);
  };



  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-5 bg-customGray overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto font-sans">
          <h2 className="text-center text-textGray mb-8 text-3xl font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-customBlue after:to-customGreen">
            Breakdown Requests Management
          </h2>

          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <div className="flex flex-1 max-w-md min-w-[250px]">
              <input
                type="text"
                placeholder="Search by vehicle registration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-customBlue transition-colors"
              />
              <button className="px-4 bg-customBlue text-white border-none rounded-r-md hover:bg-customBlue transition-colors">
                🔍
              </button>
            </div>

            <button
              className="p-3 bg-customRed text-white border-none rounded-md font-medium hover:bg-customRed hover:-translate-y-0.5 transition-all flex items-center gap-2"
              onClick={generatePDF}
            >
              <span>📄</span> Generate PDF Report
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="spinner"></div>
              <p className="mt-2 text-textGray">Loading breakdown requests...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredBreakdowns.length > 0 ? (
                filteredBreakdowns.map((breakdown) => (
                  <div
                    key={breakdown._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-customGreen relative overflow-hidden animate-fadeIn"
                  >
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                      <span className="text-lg font-semibold text-textGray">
                        {breakdown.vehicleRegistrationNumber}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          breakdown.isAccepted
                            ? 'bg-customGreen text-white'
                            : 'bg-customYellow text-black'
                        }`}
                      >
                        {breakdown.isAccepted ? 'Accepted' : 'Pending'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Customer:
                        </span>
                        <span className="text-textGray">{breakdown.customerName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Contact:
                        </span>
                        <span className="text-textGray">{breakdown.customerContactNumber}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Vehicle Type:
                        </span>
                        <span className="text-textGray">{breakdown.vehicleType}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Location:
                        </span>
                        <span className="text-textGray">
                          {breakdown.currentLocation.type === 'Address'
                            ? breakdown.currentLocation.address
                            : `${breakdown.currentLocation.coordinates[0]}, ${breakdown.currentLocation.coordinates[1]}`}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Distance:
                        </span>
                        <span className="text-textGray">{breakdown.totalDestination} km</span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Breakdown:
                        </span>
                        <span className="text-textGray">{breakdown.breakdownType}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row mb-2">
                        <span className="font-semibold text-textGray min-w-[120px]">
                          Emergency:
                        </span>
                        <span
                          className={`font-semibold px-2 py-1 rounded-md ${
                            breakdown.emergencyLevel.toLowerCase() === 'high'
                              ? 'text-customRed'
                              : breakdown.emergencyLevel.toLowerCase() === 'medium'
                              ? 'text-customYellow'
                              : 'text-customGreen'
                          }`}
                        >
                          {breakdown.emergencyLevel}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      {breakdown.isAccepted ? (
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-semibold text-textGray min-w-[120px]">
                            Driver:
                          </span>
                          <span className="text-textGray">
                            {breakdown.selectedDriverName || 'Not Assigned'}
                          </span>
                        </div>
                      ) : (
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md text-sm mt-2"
                          value={breakdown.selectedDriverName}
                          onChange={(e) => handleDriverSelection(e, breakdown._id)}
                        >
                          <option value="">Select Driver</option>
                          <option value="Driver 1">Driver 1</option>
                          <option value="Driver 2">Driver 2</option>
                          <option value="Driver 3">Driver 3</option>
                        </select>
                      )}
                    </div>

                    {!breakdown.isAccepted && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <button
                          className="flex-1 py-2 bg-customGreen text-white border-none rounded-md font-medium hover:bg-customGreen transition-all flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                          onClick={() => {
                            handleAcceptRequest(breakdown._id, breakdown.customerContactNumber);
                            // handleSendReport(breakdown._id);
                          }}
                          disabled={!breakdown.selectedDriverName}
                        >
                          ✓ Accept
                        </button>
                        <button
                          className="flex-1 py-2 bg-customRed text-white border-none rounded-md font-medium hover:bg-customRed transition-all flex items-center justify-center gap-1"
                          onClick={() => handleDelete(breakdown._id)} 
                        >
                          ✕ Delete
                        </button>
                        <button
                          className="flex-1 py-2 bg-customBlue text-white border-none rounded-md font-medium hover:bg-customBlue transition-all flex items-center justify-center gap-1"
                          onClick={() => (window.location.href = `/breakdownedit/${breakdown._id}`)}
                        >
                          ✎ Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8 bg-customGray rounded-lg text-textGray text-lg">
                  {searchTerm
                    ? `No breakdowns found for "${searchTerm}"`
                    : 'No breakdown requests available'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakdownFormAdminView;