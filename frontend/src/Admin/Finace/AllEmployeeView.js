import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { FaSearch } from 'react-icons/fa';
import './AllEmployeeView.css';
// import Sidebar from '../AdminDashboard/Sidebar';

function AllEmployeeView() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workingDays, setWorkingDays] = useState({});
    const [salaries, setSalaries] = useState({});
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    
    const employeeCardRefs = useRef({});

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8070/employee/allEmployees');
                setEmployees(response.data);
                setFilteredEmployees(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching employees');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter(employee => 
            (employee.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

    const calculateSalary = (employee, days) => {
        if (!days || isNaN(days) || days < 1 || days > 30) return 0;
        if (!employee || !employee.position) return 0;
        
        let baseSalary = 0;
        const jobTitle = (employee.position || '').toLowerCase();
        
        switch(jobTitle) {
            case 'manager':
                baseSalary = 100000;
                break;
            case 'supervisor':
                baseSalary = 75000;
                break;
            case 'worker':
                baseSalary = 50000;
                break;
            default:
                baseSalary = 45000;
        }

        const experienceBonus = baseSalary * ((employee.YrsOfExperience || 0) * 0.02);
        const dailyRate = (baseSalary + experienceBonus) / 30;
        return Math.round(dailyRate * days);
    };

    const handleDaysChange = (employeeId, days) => {
        const daysValue = parseInt(days) || 0;
        
        // Validate input
        if (daysValue < 1 || daysValue > 30) {
            setErrors({...errors, [employeeId]: 'Please enter a value between 1-30'});
        } else {
            setErrors({...errors, [employeeId]: ''});
        }
        
        setWorkingDays({...workingDays, [employeeId]: daysValue});
        const employee = employees.find(emp => emp._id === employeeId);
        if (employee) {
            const salary = calculateSalary(employee, daysValue);
            setSalaries({...salaries, [employeeId]: salary});
        }
    };

    const generatePayslip = (employeeId) => {
        const employee = employees.find(emp => emp._id === employeeId);
        if (!employee || !salaries[employeeId] || errors[employeeId]) return;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

       
        pdf.setFontSize(20);
        pdf.setTextColor(40);
        pdf.addImage('logo.png', 'PNG', 10, 10, 30, 30);
        pdf.text(' AUTOXPERT', 105, 20, { align: 'center' });
        
        pdf.setFontSize(16);
        pdf.text('EMPLOYEE PAY SLIP', 105, 30, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text(`Employee Name: ${employee.name}`, 20, 50);
        pdf.text(`Employee ID: ${employee._id}`, 20, 60);
        pdf.text(`Designation: ${employee.job}`, 20, 70);
        pdf.text(`Experience: ${employee.YrsOfExperience} years`, 20, 80);

        pdf.setFontSize(14);
        pdf.setTextColor(0, 100, 0);
        pdf.text('Payment Details', 20, 100);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        pdf.text(`Working Days: ${workingDays[employeeId]}`, 20, 110);
        pdf.text(`Monthly Salary: Rs. ${salaries[employeeId].toLocaleString()}`, 20, 120);
        
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 150);
        pdf.text('Authorized Signature: ___________', 120, 150);

        pdf.save(`payslip-${employee.name}-${employee._id}.pdf`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="employee-cards-container">
            <h2 className="page-title">All Employees Salaries</h2>
            
            {/* Search Bar */}
            <div className="search-container">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by employee name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="employee-cards-grid">
                {filteredEmployees.map((employee) => (
                    <div key={employee._id} className="employee-card" ref={el => employeeCardRefs.current[employee._id] = el}>
                        <div className="card-header">
                            <h3>{employee.name}</h3>
                            <span className={`job-badge ${employee.job ? employee.job.toLowerCase() : ''}`}>

                                {employee.job}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="employee-detail">
                                <label>Address:</label>
                                <p>{employee.address}</p>
                            </div>
                            <div className="employee-detail-row">
                                <div className="employee-detail">
                                    <label>Gender:</label>
                                    <p>{employee.gender}</p>
                                </div>
                                <div className="employee-detail">
                                    <label>Age:</label>
                                    <p>{employee.age}</p>
                                </div>
                            </div>
                            <div className="employee-detail">
                                <label>Experience:</label>
                                <p>{employee.YrsOfExperience} years</p>
                            </div>
                            <div className="salary-section">
                                <div className="working-days-input">
                                    <label>Working Days (1-30):</label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter days"
                                        min="1"
                                        max="30"
                                        value={workingDays[employee._id] || ''}
                                        onChange={(e) => handleDaysChange(employee._id, e.target.value)}
                                    />
                                    {errors[employee._id] && (
                                        <div className="error-message">{errors[employee._id]}</div>
                                    )}
                                </div>
                                <div className="salary-display">
                                    <label>Monthly Salary:</label>
                                    <p className="salary-amount">
                                        {salaries[employee._id] ? 
                                            `Rs. ${salaries[employee._id].toLocaleString()}` : 
                                            'Enter valid working days (1-30)'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="download-payslip-btn"
                                onClick={() => generatePayslip(employee._id)}
                                disabled={!salaries[employee._id] || errors[employee._id]}
                            >
                                Download Pay Slip
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllEmployeeView;