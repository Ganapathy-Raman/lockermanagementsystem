import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Locker Management System</h2>
            <p className="text-sm mb-4">
              Providing secure and efficient locker management solutions for businesses and individuals.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-white">Our Services</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">1234 Locker St, Suite 100</p>
            <p className="text-sm mb-2">City, State, ZIP Code</p>
            <p className="text-sm mb-2">Email: <a href="mailto:support@lockermanagement.com" className="text-gray-400 hover:text-white">support@lockermanagement.com</a></p>
            <p className="text-sm">Phone: <a href="tel:+1234567890" className="text-gray-400 hover:text-white">+1 (234) 567-890</a></p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Locker Management System. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
