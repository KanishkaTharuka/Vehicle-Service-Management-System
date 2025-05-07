import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SalesManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button - only visible on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`w-[250px] bg-sidebarBg p-5 flex flex-col h-screen fixed top-0 left-0 shadow-[2px_0_5px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } z-40`}>
        <div className="text-[22px] font-bold text-lightGrayText mb-10 flex items-center">
          <img src="../../logo.png" alt="Auto Expert Logo" />
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
              location.pathname === '/category' ? 'bg-activeBg text-white' : ''
            }`}
            onClick={() => navigate('/category')}
          >
            Add Category
          </li>
          <li
            className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
              location.pathname === '/items' ? 'bg-activeBg text-white' : ''
            }`}
            onClick={() => navigate('/items')}
          >
            Add Item
          </li>
          <li
            className={`py-3 px-4 my-1.5 cursor-pointer text-navText text-base rounded-md transition-all duration-300 hover:bg-hoverBg hover:text-white ${
              location.pathname === '/all-orders' ? 'bg-activeBg text-white' : ''
            }`}
            onClick={() => navigate('/all-orders')}
          >
            All Orders
          </li>
        </ul>
      </div>
    </>
  );
};

export default SalesManagerSidebar;
