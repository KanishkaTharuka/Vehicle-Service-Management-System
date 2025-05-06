import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-darkBg text-white py-10 px-5 font-sans">
      <div className="flex justify-between max-w-[1200px] mx-auto flex-wrap">
        <div className="flex-1 min-w-[200px] m-2.5 flex items-center">
          <img src="./logo.png" className="h-[200px] mr-2.5" alt="AutoExpert Logo" />
         
        </div>

        <div className="flex-1 min-w-[200px] m-2.5">
          <h4 className="text-base mb-4 text-hoverGray">Quick Links</h4>
          <ul className="list-none p-0">
            <li className="mb-2.5">
              <a href="/" className="text-white text-sm no-underline text-customRed">
                Home
              </a>
            </li>
            <li className="mb-2.5">
              <a href="/form" className="text-white text-sm no-underline hover:text-hoverGray">
                Breakdown Service
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="/commercial-vehicles"
                className="text-white text-sm no-underline hover:text-hoverGray"
              >
                Appointment
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="/online-services"
                className="text-white text-sm no-underline hover:text-hoverGray"
              >
                Online Store
              </a>
            </li>
            <li className="mb-2.5">
              <a href="/news" className="text-white text-sm no-underline hover:text-hoverGray">
                Company
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="/privacy-policy"
                className="text-white text-sm no-underline hover:text-hoverGray"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-[200px] m-2.5">
          <h4 className="text-base mb-4 text-hoverGray">Get the App</h4>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="w-[120px]"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="w-[120px]"
              />
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] m-2.5">
          <h4 className="text-base mb-4 text-hoverGray">Find Us</h4>
          <p className="text-sm m-1.5 flex items-center">
            <span className="mr-2.5">
              <FaMapMarkerAlt />
            </span>
            50/1, Gamunupura 1St Lane, kaduwela.
          </p>
          <p className="text-sm m-1.5 flex items-center">
            <span className="mr-2.5">
              <FaPhone />
            </span>
            +94 77 222 3333
          </p>
          <p className="text-sm m-1.5 flex items-center">
            <span className="mr-2.5">
              <FaEnvelope />
            </span>
            <a
              href="mailto:web@unitedmotors.lk"
              className="text-white no-underline hover:text-hoverGray"
            >
              web@unitedmotors.lk
            </a>
          </p>
        </div>

        <div className="flex-1 min-w-[200px] m-2.5">
          <h4 className="text-base mb-4 text-hoverGray">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-white text-xl w-[25px] h-[25px] flex items-center justify-center hover:bg-socialHover" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-white text-xl w-[25px] h-[25px] flex items-center justify-center hover:bg-socialHover" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-white text-xl w-[25px] h-[25px] flex items-center justify-center hover:bg-socialHover" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-white text-xl w-[25px] h-[25px] flex items-center justify-center hover:bg-socialHover" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;