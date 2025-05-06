import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { FaMotorcycle, FaClock, FaLocationArrow, FaHome } from 'react-icons/fa';

function Homepage() {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: '/images/slideImage4.jpg',
      alt: 'Perodua Axia',
      caption: 'All about the Drive.',
    },
    {
      src: '/images/slideImage2.jpg',
      alt: 'Vehicle Service',
      caption: 'Top-Notch Vehicle Maintenance.',
    },
    {
      src: '/images/slideImage3.jpg',
      alt: 'Vehicle Repair',
      caption: 'Expert Repairs for Your Ride.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="font-sans text-textGray">
      <Header />

      {/* Carousel Section */}
      <div className="relative w-full h-[650px] overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 text-white text-2xl font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                {image.caption}
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2.5">
          {carouselImages.map((_, index) => (
            <span
              key={index}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                index === currentSlide ? 'bg-customRed' : 'bg-dotGray'
              }`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center p-5">
        {loading ? <p>Loading...</p> : <h1></h1>}
      </div>

      {/* Commercial Vehicles Section (Breakdown Services) */}
      <section className="bg-white py-12 px-[5%] mx-20 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <div className="text-center mb-5">
          <h2 className="text-3xl text-darkBlue">Breakdown Services</h2>
          <div className="w-16 h-1 bg-primaryBlue mx-auto my-2.5"></div>
          <p className="mt-2">
            When starting a business or expanding your existing market reach,
            investing in a commercial vehicle or fleet is a defining point in
            your path to success. Aside from financial feasibility and ROI, the
            vehicle represents your business and your reliability.
          </p>
          <p className="mt-2">
            For this purpose, we have identified a number of iconic commercial
            vehicle manufacturers who produce reliable, versatile and
            fuel-efficient vehicles to power your business. From Crew Cabs to
            Heavy-Duty Tippers, Chassis to Full Body Trucks & Buses, we offer a
            range of options that will enable you to identify the vehicle that
            is ideal for your business needs.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-[65%]">
            <img
              src="/images/breakdown.jpg"
              alt="Commercial Vehicle"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-[35%] grid grid-cols-2 gap-4 justify-center ml-24">
            <div className="bg-primaryBlue p-5 rounded-lg text-center transition-transform duration-300 relative cursor-pointer group">
              <h3 className="text-white text-3xl transform transition-transform duration-300 ">
                <FaClock />
              </h3>
              <h4 className="text-white text-lg">24/7 roadside assistance</h4>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] bg-white p-2.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] text-left z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="text-base font-bold text-textGray">
                  24/7 roadside assistance
                </h4>
                <p className="text-sm">
                  Our breakdown bread and butter. If you break down over a 1/4
                  of a mile from home, you'll get expert roadside help or a tow
                  to a local garage.
                </p>
              </div>
            </div>

            <div className="bg-primaryBlue p-5 rounded-lg text-center transition-transform duration-300 relative cursor-pointer group">
              <h3 className="text-white text-3xl transform transition-transform duration-300 ">
                <FaLocationArrow />
              </h3>
              <h4 className="text-white text-lg">National vehicle recovery</h4>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] bg-white p-2.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] text-left z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="text-base font-bold text-textGray">
                  National vehicle recovery
                </h4>
                <p className="text-sm">
                  If your vehicle can't be fixed locally, we can take you, your
                  motor, and any passengers to a single destination you choose in
                  the Sri Lanka.
                </p>
              </div>
            </div>

            <div className="bg-primaryBlue p-5 rounded-lg text-center transition-transform duration-300 relative cursor-pointer group">
              <h3 className="text-white text-3xl transform transition-transform duration-300 ">
                <FaMotorcycle />
              </h3>
              <h4 className="text-white text-lg">Cover for different vehicles</h4>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] bg-white p-2.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] text-left z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="text-base font-bold text-textGray">
                  Cover for different vehicles
                </h4>
                <p className="text-sm">
                  Whether it's motorbike breakdown cover or car recovery that
                  you're looking for, you should be able to find the right
                  breakdown and recovery services for you.
                </p>
              </div>
            </div>

            <div className="bg-primaryBlue p-5 rounded-lg text-center transition-transform duration-300 relative cursor-pointer group">
              <h3 className="text-white text-3xl transform transition-transform duration-300 ">
                <FaHome />
              </h3>
              <h4 className="text-white text-lg">Cover at home</h4>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] bg-white p-2.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] text-left z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="text-base font-bold text-textGray">
                  Cover at home
                </h4>
                <p className="text-sm">
                  They say home is where the heart is. It can also be where a
                  technician is (if your vehicle conks out at your home and you
                  need our help).
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="block mx-auto mt-5 px-6 py-3 bg-primaryBlue text-white text-base rounded-md cursor-pointer hover:bg-darkBlue transition-colors duration-300"
          onClick={() => (window.location.href = '/form')}
        >
          Breakdown Request
        </button>
      </section>

      {/* Booking Services Section */}
      <section className="bg-white py-12 px-[5%] mx-20 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        <div className="text-center mb-5">
          <h2 className="text-3xl text-darkBlue">Booking Services</h2>
          <div className="w-16 h-1 bg-primaryBlue mx-auto my-2.5"></div>
          <p className="mt-2">
            When starting a business or expanding your existing market reach,
            investing in a commercial vehicle or fleet is a defining point in
            your path to success. Aside from financial feasibility and ROI, the
            vehicle represents your business and your reliability.
          </p>
          <p className="mt-2">
            For this purpose, we have identified a number of iconic commercial
            vehicle manufacturers who produce reliable, versatile and
            fuel-efficient vehicles to power your business. From Crew Cabs to
            Heavy-Duty Tippers, Chassis to Full Body Trucks & Buses, we offer a
            range of options that will enable you to identify the vehicle that
            is ideal for your business needs.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-[35%] grid grid-cols-2 gap-4 justify-center mr-24">
            {/* Placeholder for commercial-categories2 */}
          </div>
          <div className="w-[65%]">
            <img
              src="/images/appointment.jpg"
              alt="Commercial Vehicle"
              className="w-full rounded-lg"
            />
          </div>
        </div>
        <button className="block mx-auto mt-5 px-6 py-3 bg-primaryBlue text-white text-base rounded-md cursor-pointer hover:bg-darkBlue transition-colors duration-300">
          Book Now
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;