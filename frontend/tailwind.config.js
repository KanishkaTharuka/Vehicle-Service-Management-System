/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        //breakdown color
        customBlue: '#007bff', // Card header, edit button, close button hover
        customGreen: '#4CAF50', // Accepted badge, border-left
        customYellow: '#ffc107', // Medium emergency level
        customRed: '#dc3545', // High emergency level, delete button
        customGray: '#f5f5f5', // Read-only notice background
        acceptedText: '#2b1ae7', // Accepted text color
        textGray: '#666', // Secondary text

        // Colors from Homepage
        primaryBlue: '#115F89', // .commercial-button, .category-box background, .underline
        darkBlue: '#0A405D', // .commercial-vehicles-header h2, .commercial-button:hover
        dotGray: '#bbb', // .dot background

        // Colors from Header
        darkBg: '#1a1a1a', // .navbar background
        dropdownBg: '#333', // .dropdown-menu background
        hoverGray: '#ccc', // .nav-item:hover > span
        dropdownHover: '#444', // .dropdown-menu li:hover

        // Colors from Footer
        socialHover: '#444', // .social-icon:hover

        // Colors from MainContent.css
        purple: '#6B48FF', // .user-profile span, .chart-card select, appointmentData, .appointment-table button, .see-more
        grayText: '#999', // .user-profile .email, .metric-card h3, .chart-placeholder, .chart-card h3, .appointment-table h3, .appointment-table th
        placeholderBg: '#f0f0f0', // .chart-placeholder
        tableBorder: '#e0e0e0', // .appointment-table th, td border-bottom

        // Colors from Sidebar.css
        sidebarBg: '#2C3E50', // .sidebar background
        lightGrayText: '#ECF0F1', // .logo, .star-employee h4
        navText: '#BDC3C7', // .nav-menu li, .employee-info p
        activeBg: '#3498DB', // .nav-menu li.active, .employee-info img border
        hoverBg: '#34495E', // .nav-menu li:hover
        logoIconBg: '#E74C3C', // .logo-icon
        separator: '#7F8C8D', // .star-employee border-top
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInOut: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease forwards',
        fadeInOut: 'fadeInOut 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};