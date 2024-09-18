import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faFileInvoice,
  faCreditCard,
  faCog,
  faSignOutAlt,
  faTools,
  faCalendarAlt,
  faUserCircle,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Feature from '../Feature/Feature';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customername, setCustomerName] = useState('');
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
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 sticky top-0 h-screen">
        <div className="p-4 text-center text-lg font-bold">ABC Bank</div>
        <nav className="mt-5">
          <ul>
            <li className="hover:bg-gray-700">
              <a href="/viewlocker" className="flex items-center p-4 text-sm">
                <FontAwesomeIcon icon={faUser} className="h-6 w-6 mr-2" />
                <span>Locker Requests</span>
              </a>
            </li>
            <li className="hover:bg-gray-700">
              <a href="/viewRentalAgreement" className="flex items-center p-4 text-sm">
                <FontAwesomeIcon icon={faFileInvoice} className="h-6 w-6 mr-2" />
                <span>Rental Agreement</span>
              </a>
            </li>
            <li className="hover:bg-gray-700">
              <a href="/viewPayment" className="flex items-center p-4 text-sm">
                <FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 mr-2" />
                <span>Payment</span>
              </a>
            </li>
            <li className="hover:bg-gray-700">
              <a href="/viewMaintenance" className="flex items-center p-4 text-sm">
                <FontAwesomeIcon icon={faTools} className="h-6 w-6 mr-2" />
                <span>Maintenance</span>
              </a>
            </li>
            <li className="hover:bg-gray-700">
              <a href="/viewFeedback" className="flex items-center p-4 text-sm">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 mr-2" />
                <span>Feedback</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1 flex justify-center">
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center p-2 text-sm text-white hover:bg-gray-700 rounded-md">
              <FontAwesomeIcon icon={faBell} className="h-6 w-6 mr-2" />
              <span>Notifications</span>
            </a>
            <a href="/adminProfile" className="flex items-center p-2 text-sm text-white hover:bg-gray-700 rounded-md">
              <img
                src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&s'} // Fallback to default image
                alt="Profile"
                className="w-8 h-8 object-cover rounded-full mr-2"
              />
              <span>{customername || 'Admin'}</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 mr-2" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Welcome, Admin !</h1>
          <Feature />
        </main>
      </div>
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

export default AdminDashboard;
