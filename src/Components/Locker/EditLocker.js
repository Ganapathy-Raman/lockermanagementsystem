import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import UserHeader from "../UserHeader/UserHeader";
import ProgressStepBar from "../ProgressStepBar/ProgressStepBar"; // Adjust import path as needed
import Loader from '../Loader/Loader';

function EditLocker() {
  const { lockerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [inputData, setInputData] = useState({
    lockerId: '',
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
    idProof: "",
    status: "pending"
    });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:2026/locker/${lockerId}`)
      .then((response) => {
        console.log(JSON.stringify(response.data, null, 2)); 
        setInputData(response.data);
      })
      .catch((err) => console.log(err));
  }, [lockerId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith('customerId')) {
      setInputData(prevData => ({
        ...prevData,
        customerId: {
          ...prevData.customerId,
          [id]: value
        }
      }));
    } else {
      setInputData(prevData => ({
        ...prevData,
        [id]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:2026/locker", inputData)
      .then((res) => {
        alert("locker Updated Successfully");
        navigate("/rentalAgreement");
      })
      .catch((err) => console.log(err));
  };

  const viewMd = (idProof) =>{
    if(idProof){
      Swal.fire({
        title: 'Id Proof',
        imageUrl:`data:image/jpg;base64,${idProof}`,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt:"Id"
      });
    }
  };
  const getFileIcon = (fileType) => {
    const defaultIcon = faFileAlt;
 
    if (fileType && fileType.includes('image')) {
      return faFileImage;
    } else if (fileType && fileType.includes('pdf')) {
      return faFilePdf;
    } else {
      return defaultIcon;
    }
  };

  return (
    <>{loading && <Loader />} {/* Show loader modal if loading */}
    <UserHeader />
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <ProgressStepBar currentStep={1} /> {/* Set current step here */}
      {message && <div className="bg-red-500 text-white p-4 rounded mb-4">{message}</div>}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Request a Locker</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="customerId"
            value={inputData.customerId.customerId || ''}
          />

          <div className="mb-4">
            <label htmlFor="lockerSize" className="block text-gray-700 text-sm font-medium mb-2">Locker Size:</label>
            <select
              id="lockerSize"
              value={inputData.lockerSize}
              onChange={handleChange}

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
            <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">Location:</label>
            <select
              id="location"
              value={inputData.location}
              onChange={handleChange}
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
            <label htmlFor="belongingType" className="block text-gray-700 text-sm font-medium mb-2">Belonging Type:</label>
            <select
              id="belongingType"
              value={inputData.belongingType}
              onChange={handleChange}
              className="form-select block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select belonging type</option>
              <option value="Land Documents">Land Documents</option>
              <option value="Gold">Gold</option>
              <option value="Cash">Cash</option>
              <option value="Old Documents">Old Documents</option>
              <option value="Ornaments">Ornaments</option>
            </select>
            {errors.belongingType && <p className="text-red-500 text-xs mt-1">{errors.belongingType}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="idProof" className="block text-gray-700 text-sm font-medium mb-2">ID Proof:</label>
            <button onClick={() => viewMd(inputData.idProof)}>
                     <FontAwesomeIcon icon={getFileIcon(inputData.idProof)} size="lg" />
                 </button>
                 </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <label htmlFor="rememberMe" className="ml-2 text-gray-700 text-sm">I Acknowledge the terms and condition for the donation</label>
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

export default EditLocker;
