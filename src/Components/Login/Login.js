import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../AuthService';
import Nav from '../Nav/Nav';
import { IoMdEye, IoMdPerson } from 'react-icons/io';
import { generateCaptcha } from '../../utils/captchaGenerator';
import axios from 'axios';

const Login = () => {
  const [customerName, setCustomerName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = validateValues();

    if (result && captchaInput === captcha) {
      if (customerName === 'Admin' && password === 'Admin@777') {
        setMessage('Admin login successful');
        navigate('/adminDashboard');
        return;
      }

      setLoading(true);
      try {
        const response = await AuthService.login({ customerName, password });
        const customerData = response.data;

        if (customerData && customerData.customerId) {
          if (rememberMe) {
            setMessage('Login successful');
            sessionStorage.setItem("customername", customerName);
            sessionStorage.setItem("id", customerData.customerId);
            sessionStorage.setItem("email", customerData.email);
            await sendLoginSuccessEmail(customerData);

            setTimeout(() => {
              setLoading(false);
              navigate('/customerDashboard');
            }, 1000);
          } else {
            setMessage('Please click "Remember and keep me signed in" to proceed.');
            setLoading(false);
          }
        } else {
          setMessage('Invalid credentials');
          setLoading(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        setMessage('Invalid credentials');
        setLoading(false);
      }
    } else if (captchaInput !== captcha) {
      setCaptchaError('Incorrect CAPTCHA');
    }
  };

  const sendLoginSuccessEmail = async (customerData) => {
    const emailData = new FormData();
    emailData.append('from', 'noreply@yourdomain.com');
    emailData.append('to', customerData.email);
    emailData.append('subject', 'Login Success');
    emailData.append('body', `
      <h1>Login Successful</h1>
      <p>Dear ${customerName},</p>
      <p>Your login to ABC Bank was successful.</p>
      <p>You can now able to request a locker in our various branches of our bank.</p>
      <p>If you want any clarifications in our terms and conditions, please contact our support team immediately.</p>
      <p>Contact No : 9876543219</p>
      <p>Thank you for using ABC Bank.</p>
    `);

    try {
      await axios.post("http://localhost:2026/locker/sendEmail", emailData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      setMessage('Failed to send email');
    }
  };

  const validatePassword = (password) => {
    const regexUpperCase = /[A-Z]/;
    const regexSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    const regexNumber = /[0-9]/;

    if (!regexUpperCase.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!regexSymbol.test(password)) {
      setPasswordError('Password must contain at least one symbol');
      return false;
    }
    if (!regexNumber.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateValues = () => {
    let isValid = true;

    if (customerName.trim() === '') {
      setCustomerNameError('Please enter Customer Name');
      isValid = false;
    } else {
      setCustomerNameError('');
    }

    if (password.trim() === '') {
      setPasswordError('Please enter Password');
      isValid = false;
    } else {
      if (!validatePassword(password)) {
        isValid = false;
      }
    }

    return isValid;
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://png.pngtree.com/png-clipart/20230504/original/pngtree-free-vector-login-concept-illustration-png-image_9140539.png)' }}></div>

          <div className="w-1/2 p-8">
            {message && (
              <div className={`mb-4 p-4 rounded ${message === 'Login successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
            {loading && <div className="loader mb-4"></div>}
            <p className="text-2xl font-bold mb-6 text-center">Login</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="customername" className="flex items-center text-lg font-medium mb-2">
                  <IoMdPerson className="text-xl mr-2" /> Customer Name
                </label>
                <input
                  type="text"
                  id="customername"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setCustomerNameError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${customerNameError ? 'border-red-500' : ''}`}
                />
                {customerNameError && <p className="text-red-500 mt-1">{customerNameError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="flex items-center text-lg font-medium mb-2">
                  <IoMdEye className="text-xl mr-2" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${passwordError ? 'border-red-500' : ''}`}
                />
                {passwordError && <p className="text-red-500 mt-1">{passwordError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="captcha" className="text-lg font-medium mb-2">CAPTCHA</label>
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold bg-gray-200 px-4 py-2 rounded-md">{captcha}</span>
                </div>
                <input
                  type="text"
                  id="captcha"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    setCaptchaError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${captchaError ? 'border-red-500' : ''}`}
                />
                {captchaError && <p className="text-red-500 mt-1">{captchaError}</p>}
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-sm">Remember and keep me signed in!</label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Sign in
              </button>
            </form>
            <p className="text-center mt-6 text-sm">Don't have an account? <Link to="/register" className="text-teal-500 hover:underline">Sign up</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
