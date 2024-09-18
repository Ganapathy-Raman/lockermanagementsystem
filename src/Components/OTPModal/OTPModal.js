import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const OtpModal = ({ isOpen, onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && value !== '') {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose(); 
    }, 2000); 
  };

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" style={{ pointerEvents: 'none' }} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto w-full flex flex-col items-center relative">
          <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                autoFocus={index === 0}
                style={{ 
                  WebkitTextSecurity: 'disc',
                  textSecurity: 'disc'
                }}
              />
            ))}
          </form>
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="loader border-t-4 border-teal-500 border-solid rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
              <p className="mt-4 text-lg font-semibold text-teal-600">Processing Payment...</p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Verify OTP
              </button>
              <button
                onClick={onClose}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default OtpModal;
