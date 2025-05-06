import React, { useState } from 'react';

const Header = () => {
  const [dropdown, setDropdown] = useState({
    vehicles: false,
    parts: false,
    Appointment: false,
    otherProducts: false,
    construction: false,
    company: false,
  });

  // Toggle dropdown visibility
  const toggleDropdown = (menu) => {
    setDropdown((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav className="flex justify-between items-center bg-darkBg px-5 py-2.5 text-white font-sans">
      <div className="flex items-center">
        <img src="./logo.png" className="h-[60px] mr-2.5" alt="AutoExpert Logo" />
        <span className="text-lg font-bold">AUTOEXPERT</span>
      </div>
      <ul className="flex list-none m-0 p-0">
        <li className="relative mx-4 cursor-pointer text-sm">
          <span
            className="text-white hover:text-hoverGray"
            onClick={() => (window.location.href = '/')}
          >
            HOME
          </span>
        </li>

        <li
          className="relative mx-4 cursor-pointer text-sm group"
          onMouseEnter={() => toggleDropdown('parts')}
          onMouseLeave={() => toggleDropdown('parts')}
        >
          <span className="text-white hover:text-hoverGray">
            BREAKDOWN SERVICES
          </span>
          {dropdown.parts && (
            <ul className="absolute top-full left-0 bg-dropdownBg list-none p-2.5 m-0 min-w-[150px] shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-[1000]">
              <li
                className="px-4 py-2 text-white text-sm hover:bg-dropdownHover"
                onClick={() => (window.location.href = '/form')}
              >
                Form
              </li>
              <li className="px-4 py-2 text-white text-sm hover:bg-dropdownHover">
                Call Now
              </li>
            </ul>
          )}
        </li>

        <li className="relative mx-4 cursor-pointer text-sm">
          <span className="text-white hover:text-hoverGray">APPOINTMENT</span>
        </li>

        <li className="relative mx-4 cursor-pointer text-sm"
        onClick={() => (window.location.href = '/itemBrowser')}>
          <span className="text-white hover:text-hoverGray">ONLINE STORE</span>
        </li>

        <li
          className="relative mx-4 cursor-pointer text-sm group"
          onMouseEnter={() => toggleDropdown('company')}
          onMouseLeave={() => toggleDropdown('company')}
        >
          <span className="text-white hover:text-hoverGray">COMPANY</span>
          {dropdown.company && (
            <ul className="absolute top-full left-0 bg-dropdownBg list-none p-2.5 m-0 min-w-[150px] shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-[1000]">
              <li className="px-4 py-2 text-white text-sm hover:bg-dropdownHover">
                About Us
              </li>
              <li className="px-4 py-2 text-white text-sm hover:bg-dropdownHover">
                Our History
              </li>
              <li className="px-4 py-2 text-white text-sm hover:bg-dropdownHover">
                Careers
              </li>
            </ul>
          )}
        </li>

        <li className="relative mx-4 cursor-pointer text-sm">
          <span className="text-white hover:text-hoverGray">CONTACT US</span>
        </li>
      </ul>
    </nav>
  );
};

export default Header;