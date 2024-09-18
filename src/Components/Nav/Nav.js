import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaBoxOpen, FaRegEnvelope, FaTools } from 'react-icons/fa';

function Nav() {
  return (
    <header className="bg-gray-800 text-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <FaHome className="text-green-500" />
          <span>ABC Bank</span>
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="flex items-center hover:text-gray-400">
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center hover:text-gray-400">
              <FaSignInAlt className="mr-2" /> Login
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center hover:text-gray-400">
              <FaBoxOpen className="mr-2" /> Request Locker
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center hover:text-gray-400">
              <FaRegEnvelope className="mr-2" /> Feedback
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center hover:text-gray-400">
              <FaTools className="mr-2" /> Maintenance
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
