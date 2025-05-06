import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { 
  FaCalendarAlt, FaCar, FaUser, FaPhone, 
  FaEnvelope, FaMapMarkerAlt, FaTools, 
  FaMoneyBillWave, FaFileDownload 
} from 'react-icons/fa';

import Sidebar from '../AdminDashboard/Sidebar';

const AllAppointmentsView = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8070/finance/appointments');
            setAppointments(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching appointments');
            setLoading(false);
            console.error('Error:', err);
        }
    };

    const calculateServicePrice = (serviceType, vehicleModel) => {
        const servicePrices = {
            'oil change': 5000,
            'tire rotation': 3000,
            'brake service': 8000,
            'battery check': 2000,
            'engine diagnostic': 10000,
            'full service': 15000,
            'default': 4000
        };

        const isLuxuryVehicle = ['BMW', 'Mercedes', 'Audi', 'Lexxus', 'Tesla']
            .some(brand => vehicleModel.toLowerCase().includes(brand.toLowerCase()));

        const basePrice = servicePrices[serviceType.toLowerCase()] || servicePrices['default'];
        return isLuxuryVehicle ? Math.round(basePrice * 1.2) : basePrice;
    };

    const generateBillPDF = (appointment) => {
        const servicePrice = calculateServicePrice(appointment.servicetype, appointment.vehicalmodel);
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.addImage('/logo.png', 'PNG', 10, 10, 30, 30);
        doc.text('AUTOEXPERT SERVICE CENTER', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('SERVICE INVOICE', 105, 30, { align: 'center' });

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        let yPosition = 50;
        
        doc.text(`Customer Name: ${appointment.cusname}`, 20, yPosition);
        doc.text(`Vehicle: ${appointment.vehicalmodel}`, 20, yPosition + 10);
        doc.text(`Service Type: ${appointment.servicetype}`, 20, yPosition + 20);
        doc.text(`Appointment Date: ${appointment.date} at ${appointment.time}`, 20, yPosition + 30);
        doc.text(`Contact: ${appointment.phone}`, 20, yPosition + 40);
        doc.text(`Email: ${appointment.email}`, 20, yPosition + 50);
        doc.text(`Address: ${appointment.address.street}, ${appointment.address.city}`, 20, yPosition + 60);

        yPosition += 80;
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 0);
        doc.text('Payment Details', 20, yPosition);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Service: ${appointment.servicetype}`, 20, yPosition + 10);
        doc.text(`Vehicle Type: ${appointment.vehicalmodel}`, 20, yPosition + 20);
        
        const isLuxury = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Tesla']
            .some(brand => appointment.vehicalmodel.toLowerCase().includes(brand.toLowerCase()));
        
        if (isLuxury) {
            doc.text('(Luxury Vehicle Surcharge: 20%)', 20, yPosition + 30);
        }
        
        doc.text(`Total Amount: Rs. ${servicePrice.toLocaleString()}`, 20, yPosition + 40);

        yPosition += 60;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for choosing AutoExpert!', 105, yPosition, { align: 'center' });
        doc.text('Contact: 011-1234567 | Email: info@autoexpert.lk', 105, yPosition + 10, { align: 'center' });

        doc.save(`Service-Invoice-${appointment.cusname}-${appointment.date}.pdf`);
    };

    if (loading) {
        return (
            <div className="bg-white bg-opacity-90 p-5 rounded-lg text-center text-gray-600 text-lg max-w-md mx-auto my-5">
                Loading appointments...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white bg-opacity-90 p-5 rounded-lg text-center text-red-600 text-lg max-w-md mx-auto my-5">
                {error}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-100"
                style={{ backgroundImage: "url('/slideImage2.jpg')" }}
            ></div>
            <div className="w-[300px] flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-1 p-5 bg-gray-50 overflow-y-auto">
            
            {/* Overlay */}
            <div className="fixed inset-0 bg-white bg-opacity-85 z-[-1]"></div>
            {/* Content */}
            <div className="relative max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-8">All Appointments Payments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                    {appointments.map((appointment) => {
                        const servicePrice = calculateServicePrice(appointment.servicetype, appointment.vehicalmodel);
                        return (
                            <div
                                key={appointment._id}
                                className="flex flex-col h-full bg-white bg-opacity-95 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-center p-4 border-b border-gray-200 bg-blue-600">
                                    <FaUser className="text-white mr-2 text-lg" />
                                    <h3 className="text-lg font-semibold text-white">{appointment.cusname}</h3>
                                    <div className="ml-auto flex items-center bg-gray-100 px-2 py-1 rounded-full font-bold text-green-600">
                                        <FaMoneyBillWave className="mr-1 text-green-600" />
                                        <span>Rs. {servicePrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 flex flex-col gap-3">
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">{appointment.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">{appointment.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCar className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">{appointment.vehicalmodel}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaTools className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">{appointment.servicetype}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">
                                            {appointment.address.street}, {appointment.address.city}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="text-gray-500 mr-2 text-lg" />
                                        <span className="text-gray-800">
                                            {appointment.date} at {appointment.time}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="flex items-center justify-center w-full p-3 bg-green-500 text-white rounded-b-lg hover:bg-green-600 transition-all mt-auto"
                                    onClick={() => generateBillPDF(appointment)}
                                >
                                    <FaFileDownload className="mr-2" />
                                    Download Bill
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        </div>
    );
};

export default AllAppointmentsView;