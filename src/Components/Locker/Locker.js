import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import ProgressStepBar from "../ProgressStepBar/ProgressStepBar";
import Loader from '../Loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faTag, faFileAlt, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

function Locker() {
  const [inputData, setInputData] = useState({
    customerId: {
      customerId: "",
      customerName: "",
      email: "",
      phoneNo: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      password: ""
    },
    lockerSize: "",
    location: "",
    belongingType: "",
    idProof: null,
    status: "pending"
  });

  const [idProofPreview, setIdProofPreview] = useState(null);
  const [fileInputVisible, setFileInputVisible] = useState(true);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
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
        customerId: { customerId: sessioncustomerId }
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
        customerId: response.data
      }));
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const validateValues = (data) => {
    const errors = {};

    if (!data.customerId.customerId) errors.customerId = "Please select a user id";
    if (!data.lockerSize.trim()) errors.lockerSize = "Please enter locker size";
    if (!data.location.trim()) errors.location = "Please enter location";
    if (!data.belongingType.trim()) errors.belongingType = "Please enter belonging type";
    if (!(data.idProof instanceof File) && !data.idProof) {
      errors.idProof = "Please upload an ID proof";
    }
    if (!data.status.trim()) errors.status = "Status should be pending";

    return errors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'application/pdf'];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        setInputData(prevState => ({
          ...prevState,
          idProof: file,
        }));
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        setIdProofPreview(previewUrl);
        setFileInputVisible(false);

        setErrors(prevErrors => ({
          ...prevErrors,
          idProof: ''
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          idProof: 'Unsupported file type. Please upload a JPG or PDF file.'
        }));
        e.target.value = null;
      }
    }
  };

  const handleCancelUpload = () => {
    setIdProofPreview(null);
    setInputData(prevState => ({
      ...prevState,
      idProof: null
    }));
    setFileInputVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateValues(inputData);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('customerId', inputData.customerId.customerId);
      formData.append('lockerSize', inputData.lockerSize);
      formData.append('location', inputData.location);
      formData.append('belongingType', inputData.belongingType);
      formData.append('status', inputData.status);
      if (inputData.idProof instanceof File) {
        formData.append('idProof', inputData.idProof);
      }

      try {
        setLoading(true);
        const response = await axios.post("http://localhost:2026/locker", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Locker details posted successfully:', response.data);
        setMessage('Request successfully sent. Check your email for confirmation.');

        setTimeout(() => {
          setLoading(false);
          navigate('/rentalAgreement');
        }, 200);

      } catch (error) {
        console.error("Error posting locker details:", error);
        setMessage('Locker Request failed');
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <UserHeader />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <ProgressStepBar currentStep={1} />

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
          <h2 className="text-2xl font-bold mb-6 text-center">Locker Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="bankName" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                Bank Name:
              </label>
              <input
                id="bankName"
                type="text"
                value="ABC Bank"
                readOnly
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
              />
            </div>

            <input
              type="hidden"
              name="customerId"
              value={inputData.customerId.customerId || ''}
            />

            <div className="mb-4">
              <label htmlFor="lockerSize" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                Locker Size:
              </label>
              <select
                id="lockerSize"
                value={inputData.lockerSize}
                onChange={(e) => setInputData({ ...inputData, lockerSize: e.target.value })}
                className="form-select block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra_large">Extra Large</option>
              </select>
              {errors.lockerSize && <p className="text-red-500 text-xs mt-1">{errors.lockerSize}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Location:
              </label>
              <select
                id="location"
                value={inputData.location}
                onChange={(e) => setInputData({ ...inputData, location: e.target.value })}
                className="form-select block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select location</option>
                <option value="madurai">Madurai</option>
                <option value="dindigul">Dindigul</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="trichy">Trichy</option>
                <option value="tanjore">Tanjore</option>
                <option value="chennai">Chennai</option>
                <option value="salem">Salem</option>
                <option value="karur">Karur</option>
                <option value="thirunelveli">Thirunelveli</option>
                <option value="kovilpatti">Kovilpatti</option>
                <option value="tuticorin">Tuticorin</option>
              </select>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCheckSquare} className="mr-2" />
                Belonging Type:
              </label>
              <div className="flex flex-col space-y-2">
                {['Land Documents', 'Gold', 'Cash', 'Old Documents', 'Ornaments'].map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      id={type}
                      type="radio"
                      name="belongingType"
                      value={type}
                      checked={inputData.belongingType === type}
                      onChange={(e) => setInputData({ ...inputData, belongingType: e.target.value })}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <label htmlFor={type} className="ml-2 text-gray-700 text-sm">{type}</label>
                  </div>
                ))}
              </div>
              {errors.belongingType && <p className="text-red-500 text-xs mt-1">{errors.belongingType}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="idProof" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                ID Proof:
              </label>
              {fileInputVisible ? (
                <input
                  id="idProof"
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <div className="mt-4">
                  {inputData.idProof && inputData.idProof.type.startsWith('image/') && (
                    <img src={idProofPreview} alt="ID Proof preview" className="max-w-full h-auto rounded-md" />
                  )}
                  {inputData.idProof && inputData.idProof.type === 'application/pdf' && (
                    <embed src={idProofPreview} type="application/pdf" className="w-full h-64" />
                  )}
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel Upload
                  </button>
                </div>
              )}
              {errors.idProof && <p className="text-red-500 text-xs mt-1">{errors.idProof}</p>}
            </div>
            <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Locker;
