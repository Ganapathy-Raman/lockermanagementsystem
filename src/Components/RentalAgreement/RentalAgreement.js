import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import ProgressStepBar from "../ProgressStepBar/ProgressStepBar";
import Loader from '../Loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faDollarSign, faSignature } from '@fortawesome/free-solid-svg-icons';

const RentalAgreement = () => {
  const [inputData, setInputData] = useState({
    customerId: "",
    lockerId: "",
    startDate: "",
    endDate: "",
    rentalFee: "",
    signature: "",
    status: "pending"
  });
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [fileInputVisible, setFileInputVisible] = useState(true);
  const [records, setRecords] = useState([]);
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:2026/api/all")
      .then(response => setRecords(response.data))
      .catch(err => console.error("Error fetching Users:", err));
  }, []);

  useEffect(() => {
    const sessioncustomerId = sessionStorage.getItem("id");
    const sessioncustomerName = sessionStorage.getItem("customername");

    if (sessioncustomerId) {
      setInputData(prevState => ({
        ...prevState,
        customerId: sessioncustomerId
      }));
      fetchUserData(sessioncustomerId);
    }

    if (sessioncustomerName) {
      setInputData(prevState => ({
        ...prevState,
        customerName: sessioncustomerName
      }));
    }
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:2026/api/${id}`);
      setInputData(prevState => ({
        ...prevState,
        customerId: response.data.customerId
      }));
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    const customerId = sessionStorage.getItem("id");
    const fetchLockerData = async () => {
      try {
        const response = await axios.get(`http://localhost:2026/locker/customer/${customerId}`);
        const lockerData = response.data;

        setInputData(prevState => ({
          ...prevState,
          lockerId: lockerData.lockerId,
          rentalFee: calculateMonthlyFee(lockerData.lockerSize)
        }));

      } catch (err) {
        console.error("Error fetching locker data:", err);
      }
    };

    fetchLockerData();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:2026/locker/all")
      .then(response => setDonors(response.data))
      .catch(err => console.error("Error fetching donors:", err));
  }, []);

  const calculateMonthlyFee = (lockerSize) => {
    switch (lockerSize) {
      case 'small':
        return 1000;
      case 'medium':
        return 2000;
      case 'large':
        return 3000;
      case 'extra_large':
        return 4000;
      default:
        return 0;
    }
  };

  const calculateMonthsDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    return Math.max(months, 0);
  };

  const calculateRentalFee = (startDate, endDate, monthlyFee) => {
    const months = calculateMonthsDifference(startDate, endDate);
    return months * monthlyFee;
  };

  const validateValues = (data) => {
    const errors = {};

    if (!data.startDate) {
      errors.startDate = "Please select a start date";
    }

    if (!data.endDate) {
      errors.endDate = "Please select an end date";
    } else if (data.startDate && new Date(data.endDate) < new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 1))) {
      errors.endDate = "End date must be at least one month after start date";
    }

    if (!(data.signature instanceof File) && !data.signature) {
      errors.signature = "Please upload Digital Signature";
    }

    return errors;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setInputData(prevState => {
      const updatedData = { ...prevState, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        if (updatedData.startDate && updatedData.endDate) {
          const monthlyFee = parseFloat(prevState.rentalFee);
          updatedData.rentalFee = calculateRentalFee(updatedData.startDate, updatedData.endDate, monthlyFee);
        }
        if (name === 'startDate') {
          const startDate = new Date(value);
          const minEndDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
          updatedData.endDate = minEndDate.toISOString().split('T')[0];
        }
      }
      return updatedData;
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinEndDate = () => {
    if (!inputData.startDate) return getTodayDate();
    const startDate = new Date(inputData.startDate);
    const minEndDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    return minEndDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateValues(inputData);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('customerId', inputData.customerId);
      formData.append('lockerId', inputData.lockerId ? parseInt(inputData.lockerId, 10) : "");
      formData.append('startDate', inputData.startDate);
      formData.append('endDate', inputData.endDate);
      formData.append('rentalFee', inputData.rentalFee);
      formData.append('status', inputData.status);

      if (inputData.signature instanceof File) {
        formData.append('signature', inputData.signature);
      }
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        setLoading(true);
        const response = await axios.post("http://localhost:2026/rentalAgreement", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const agreementId = response.data;

        console.log('Rental Agreement posted successfully:', response.data);
        sessionStorage.setItem("rentalFee", inputData.rentalFee);
        sessionStorage.setItem("agreementId", agreementId);

        setMessage('Rental agreement registered successfully.');
        setTimeout(() => {
          setLoading(false);
          navigate('/maintenance', { state: { agreementData: inputData } });
        }, 2000);

      } catch (error) {
        console.error("Error posting rental agreement:", error);
        setMessage('Rental agreement registration failed');
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'application/pdf'];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        setInputData(prevState => ({
          ...prevState,
          signature: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setSignaturePreview(previewUrl);
        setFileInputVisible(false);

        setErrors(prevErrors => ({
          ...prevErrors,
          signature: ''
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          signature: 'Unsupported file type. Please upload a JPG or PDF file.'
        }));
        e.target.value = null;
      }
    }
  };

  const handleCancelUpload = () => {
    setSignaturePreview(null);
    setInputData(prevState => ({
      ...prevState,
      signature: ''
    }));
    setFileInputVisible(true);
  };

  return (
    <>
      {loading && <Loader />}
      <UserHeader />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <ProgressStepBar currentStep={2} />
        {message && (
          <div
            className={`p-4 rounded mb-4 ${message.includes("failed") || message.includes("error") || message.includes("unsuccessfully")
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
              }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Agreement</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="customerId"
              value={inputData.customerId || ''}
            />
            <input
              type="hidden"
              name="lockerId"
              value={inputData.lockerId}
            />

            <div className="mb-4">
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={inputData.startDate}
                onChange={handleDateChange}
                min={getTodayDate()}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={inputData.endDate}
                onChange={handleDateChange}
                min={getMinEndDate()}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="rentalFee" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Rental Fee:
              </label>
              <input
                id="rentalFee"
                type="text"
                value={inputData.rentalFee}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly
              />
              {errors.rentalFee && <p className="text-red-500 text-xs mt-1">{errors.rentalFee}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="signature" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faSignature} className="mr-2" />
                Digital Signature:
              </label>
              {fileInputVisible ? (
                <>
                  <input
                    id="signature"
                    type="file"
                    accept="image/jpeg,application/pdf"
                    onChange={handleFileChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature}</p>}
                </>
              ) : (
                <div className="mt-4">
                  <img src={signaturePreview} alt="Signature preview" className="max-w-full h-auto rounded-md" />
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel Upload
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RentalAgreement;
