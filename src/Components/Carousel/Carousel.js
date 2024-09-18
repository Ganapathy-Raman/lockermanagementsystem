import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    "https://media.istockphoto.com/id/521303664/photo/safe-deposit-boxes-with-open-one-cell.jpg?s=612x612&w=0&k=20&c=-9wNGxVW51s3FWoyuLz0asneBVwPzpUaXi7q1Zi7NEk=",
    "https://media.istockphoto.com/id/521303664/photo/safe-deposit-boxes-with-open-one-cell.jpg?s=612x612&w=0&k=20&c=-9wNGxVW51s3FWoyuLz0asneBVwPzpUaXi7q1Zi7NEk=",
    "https://media.istockphoto.com/id/521303664/photo/safe-deposit-boxes-with-open-one-cell.jpg?s=612x612&w=0&k=20&c=-9wNGxVW51s3FWoyuLz0asneBVwPzpUaXi7q1Zi7NEk="
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-gray-100">
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-4 rounded-full hover:bg-gray-700 focus:outline-none z-10"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl sm:text-2xl" />
      </button>
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full">
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-4 rounded-full hover:bg-gray-700 focus:outline-none z-10"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xl sm:text-2xl" />
      </button>
    </div>
  );
};

export default Carousel;
