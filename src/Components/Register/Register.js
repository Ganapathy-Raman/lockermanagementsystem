import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../AuthService';
import Nav from '../Nav/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCalendarDay, faLock, faGenderless, faAddressCard, faPhone } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Register = () => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [message, setMessage] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const navigate = useNavigate();

  const getMinDateOfBirth = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const minDateOfBirth = getMinDateOfBirth();

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

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    return validatePassword(confirmPassword);
  };

  const validateValues = () => {
    let isValid = true;

    if (customerName.trim() === '') {
      setCustomerNameError('Please enter customer name');
      isValid = false;
    } else if (!/^[A-Z][A-Za-z0-9 ]{2,19}$/.test(customerName)) {
      setCustomerNameError('Customer Name must start with a capital letter and be 3-20 characters long');
      isValid = false;
    } else {
      setCustomerNameError('');
    }

    if (email.trim() === '') {
      setEmailError('Please enter email');
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,255}$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (dateOfBirth.trim() === '') {
      setDateOfBirthError('Please choose date of birth');
      isValid = false;
    } else if (new Date(dateOfBirth) > new Date(minDateOfBirth)) {
      setDateOfBirthError('You must be at least 18 years old');
      isValid = false;
    } else {
      setDateOfBirthError('');
    }

    if (gender.trim() === '') {
      setGenderError('Please select gender');
      isValid = false;
    } else {
      setGenderError('');
    }

    if (password.trim() === '') {
      setPasswordError('Please enter password');
      isValid = false;
    } else {
      if (!validatePassword(password)) {
        isValid = false;
      }
    }

    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else {
      if (!validateConfirmPassword(password, confirmPassword)) {
        isValid = false;
      }
    }

    if (address.trim() === '') {
      setAddressError('Please enter address');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (phoneNo.trim() === '') {
      setPhoneNoError('Please enter phone number');
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNo)) {
      setPhoneNoError('Phone number must be 10 digits long');
      isValid = false;
    } else {
      setPhoneNoError('');
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneNo(value);
      setPhoneNoError('');
    } else {
      setPhoneNoError('Please enter a valid phone number');
    }
  };

  const handleKeyPress = (e) => {
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = validateValues();

    if (result) {
      try {
        const response = await AuthService.register({ customerName, email, dateOfBirth, gender, password, address, phoneNo });
        setMessage('Registration Successful');

        Swal.fire({
          title: 'Registration Successful!',
          text: 'You can now log in.',
          icon: 'success',
          confirmButtonText: 'Go To Login'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } catch (error) {
        setMessage('Registration failed');
        Swal.fire({
          title: 'Registration Failed',
          text: 'There was an error with your registration.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    }
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 overflow-y-auto">
            {message && (
              <div className={`mb-4 p-4 rounded ${message === 'Registration Successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <p className="text-2xl font-bold mb-6 text-center">Register</p>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="customerName" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-xl mr-2" /> Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
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
                <label htmlFor="email" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xl mr-2" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="dob" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faCalendarDay} className="text-xl mr-2" /> Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setDateOfBirthError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${dateOfBirthError ? 'border-red-500' : ''}`}
                  max={minDateOfBirth}
                />
                {dateOfBirthError && <p className="text-red-500 mt-1">{dateOfBirthError}</p>}
              </div>

              <div className="mb-4">
                <label className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faGenderless} className="text-xl mr-2" /> Gender
                </label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    /> Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    /> Female
                  </label>
                </div>
                {genderError && <p className="text-red-500 mt-1">{genderError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faAddressCard} className="text-xl mr-2" /> Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${addressError ? 'border-red-500' : ''}`}
                />
                {addressError && <p className="text-red-500 mt-1">{addressError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="phoneNo" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faPhone} className="text-xl mr-2" /> Phone No
                </label>
                <input
                  type="text"
                  id="phoneNo"
                  value={phoneNo}
                  maxLength="10"
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${phoneNoError ? 'border-red-500' : ''}`}
                />
                {phoneNoError && <p className="text-red-500 mt-1">{phoneNoError}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faLock} className="text-xl mr-2" /> Password
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
                <label htmlFor="confirmPassword" className="flex items-center text-lg font-medium mb-2">
                  <FontAwesomeIcon icon={faLock} className="text-xl mr-2" /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError('');
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${confirmPasswordError ? 'border-red-500' : ''}`}
                />
                {confirmPasswordError && <p className="text-red-500 mt-1">{confirmPasswordError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
