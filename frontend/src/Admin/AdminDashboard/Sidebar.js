import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  return (
    <div className="w-[250px] bg-sidebarBg p-5 flex flex-col h-screen fixed top-0 left-0 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
      <div className="text-[22px] font-bold text-lightGrayText mb-10 flex items-center">
        <img src="../../logo.png" alt="Logo" />
      </div>
      <ul className="list-none p-0 flex-grow">
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/mainContent' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/mainContent')}
        >
          Dashboard
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/breakdown-form-admin' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/breakdown-form-admin')}
        >
          Breakdown
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/customers' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/customers')}
        >
          Customers
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/appointment' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/appointment')}
        >
          Appointment
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/online-store' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/online-store')}
        >
          Online Store
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/financial' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/financial')}
        >
          Financial
        </li>
        <li
          className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
            location.pathname === '/admin/employee-management' ? 'bg-activeBg text-white' : ''
          }`}
          onClick={() => navigate('/admin/employee-management')}
        >
          Employee Management
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;