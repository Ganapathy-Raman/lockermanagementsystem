import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faUserCircle,
  faSignOutAlt,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [customerName, setCustomerName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomerName = sessionStorage.getItem('customername');
    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedCustomerName) {
      setCustomerName(storedCustomerName);
    }
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  }, []);

  const handleBackClick = () => {
    navigate('/adminDashboard');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div>
      <header className="bg-gray-800 text-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-6 w-6 mr-2" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="flex items-center p-2 text-sm text-white hover:bg-gray-700 rounded-md">
            <FontAwesomeIcon icon={faBell} className="h-6 w-6 mr-2" />
            <span>Notifications</span>
          </a>
          <a href="/adminProfile" className="flex items-center p-2 text-sm text-white hover:bg-gray-700 rounded-md">
            <img
              src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&s'}
              alt="Profile"
              className="w-8 h-8 object-cover rounded-full mr-2"
            />
            <span>{customerName || 'Admin'}</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 mr-2" />
            Logout
          </button>
        </div>
      </header>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
