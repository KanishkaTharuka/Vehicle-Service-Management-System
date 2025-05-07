import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const MainContent = () => {
  const [breakdownCount, setBreakdownCount] = useState(0);
  const [breakdownServiceData, setBreakdownServiceData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Breakdown Service Types',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  });

  useEffect(() => {
    const fetchBreakdownCount = async () => {
      try {
        const response = await axios.get('http://localhost:8070/breakdown/count');
        setBreakdownCount(response.data.count);
      } catch (error) {
        console.error('Error fetching breakdown count:', error);
      }
    };

    const fetchBreakdownServiceData = async () => {
      try {
        const response = await axios.get('http://localhost:8070/breakdown/view');
        const breakdowns = response.data;

        const breakdownTypes = ['Mechanical', 'Electrical', 'Flat Tire', 'Fuel Issue', 'Other'];
        const breakdownCounts = breakdownTypes.map((type) =>
          breakdowns.filter((breakdown) => breakdown.breakdownType === type).length
        );

        setBreakdownServiceData({
          labels: breakdownTypes,
          datasets: [
            {
              label: 'Breakdown Service Types',
              data: breakdownCounts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching breakdown service data:', error);
      }
    };

    fetchBreakdownCount();
    fetchBreakdownServiceData();
  }, []);

  const appointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Total Appointments',
        data: [15, 20, 22, 18, 25, 10, 5],
        backgroundColor: '#6B48FF',
      },
      {
        label: 'Canceled Appointments',
        data: [2, 3, 5, 4, 3, 1, 0],
        backgroundColor: '#FF4D4F',
      },
    ],
  };

  const customerData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Customers',
        data: [30, 35, 40, 25, 20, 15, 10],
        borderColor: '#00C4B4',
        fill: false,
      },
      {
        label: 'Returning Customers',
        data: [20, 25, 44, 30, 35, 40, 20],
        borderColor: '#6B48FF',
        fill: false,
      },
    ],
  };

  const financialData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue',
        data: [5000, 7000, 8000, 6000, 9000, 10000], // Example data, replace with actual data from API
        backgroundColor: '#4BC0C0',
      },
      {
        label: 'Expenses',
        data: [3000, 4000, 5000, 3500, 4500, 5000], // Example data, replace with actual data from API
        backgroundColor: '#FF6384',
      },
    ],
  };

  return (
    <div className="flex min-h-screen font-sans">
      <div className="w-[300px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-5 bg-customGray overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl text-textGray">Dashboard Overview</h1>
          <div className="flex items-center">
            <span className="mr-2.5 text-purple">
              <FaUser />
            </span>
            <span className="mr-2.5 text-purple">Kanishka</span>
            <span className="text-grayText">autoexpert@gmail.com</span>
          </div>
        </div>

        <div className="flex gap-5 mb-5">
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-center">
            <h3 className="text-base text-grayText mb-2.5">Revenue</h3>
            <p className="text-2xl font-bold text-textGray">$30,000</p>
            <div className="h-[50px] bg-placeholderBg rounded-md flex items-center justify-center text-grayText text-xs">
              Line Chart Placeholder
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-center">
            <h3 className="text-base text-grayText mb-2.5">Daily Sales</h3>
            <p className="text-2xl font-bold text-textGray">$10,000</p>
            <div className="h-[50px] bg-placeholderBg rounded-md flex items-center justify-center text-grayText text-xs">
              Line Chart Placeholder
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-center">
            <h3 className="text-base text-grayText mb-2.5">Average Appointment Time</h3>
            <p className="text-2xl font-bold text-textGray">3 hrs</p>
            <div className="h-[50px] bg-placeholderBg rounded-md flex items-center justify-center text-grayText text-xs">
              Bar Chart Placeholder
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-center">
            <h3 className="text-base text-grayText mb-2.5">Breakdown Requests</h3>
            <p className="text-2xl font-bold text-textGray">{breakdownCount}</p>
            <div className="h-[50px] bg-placeholderBg rounded-md flex items-center justify-center text-grayText text-xs">
              Bar Chart Placeholder
            </div>
          </div>
        </div>

        {/* <div className="flex gap-5 mb-5">
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
            <h3 className="text-base text-grayText mb-2.5">Appointment Statistics</h3>
            <select className="float-right border-none text-purple text-sm">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
            <div className="h-[200px]">
              <Bar data={appointmentData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
            <h3 className="text-base text-grayText mb-2.5">Customers</h3>
            <select className="float-right border-none text-purple text-sm">
              <option>Last Week</option>
              <option>This Week</option>
            </select>
            <div className="h-[200px]">
              <Line data={customerData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div> */}

       <div className="flex gap-5 mb-5">
          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
            <h3 className="text-base text-grayText mb-2.5">Breakdown Service Types</h3>
            <div className="h-[200px]">
              <Bar data={breakdownServiceData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="flex-1 bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
            <h3 className="text-base text-grayText mb-2.5">Financial Overview</h3>
            <div className="h-[200px]">
              <Bar data={financialData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
          <h3 className="text-base text-grayText mb-5">Appointment of the Week</h3>
          {/* <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Name
                </th>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Time & Date
                </th>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Email
                </th>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Service Required
                </th>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Car Model & Registration No
                </th>
                <th className="p-2.5 text-left border-b border-tableBorder text-grayText font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Devon Lane
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  04:00 PM, 18th Nov 2022
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  dolores.chambers@example.com
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Car Diagnostic
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Toyota Corolla 1.3, AA5-123
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder">
                  <button className="bg-purple text-white border-none px-2.5 py-1 rounded-md cursor-pointer">
                    View Details
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Annette Black
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  04:00 PM, 18th Nov 2022
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  jessica.hanson@example.com
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Inner Cleaning
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Honda Yaris, BA5-123
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder">
                  <button className="bg-purple text-white border-none px-2.5 py-1 rounded-md cursor-pointer">
                    View Details
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Robert Fox
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  04:00 PM, 18th Nov 2022
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  nevaeh.simmons@example.com
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Car Diagnostic
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder text-textGray">
                  Citroen, CA5-123
                </td>
                <td className="p-2.5 text-left border-b border-tableBorder">
                  <button className="bg-purple text-white border-none px-2.5 py-1 rounded-md cursor-pointer">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table> */}
          <button className="block mx-auto mt-5 bg-transparent text-purple border border-purple px-5 py-2.5 rounded-md cursor-pointer">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;