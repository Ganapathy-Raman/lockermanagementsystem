import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import Loader from '../Loader/Loader';
import ProgressStepBar from "../ProgressStepBar/ProgressStepBar";

const Maintenance = () => {
  const defaultMaintenanceDate = "2024-10-10";
  const maintenanceCost = 150;

  const [inputData, setInputData] = useState({
    lockerId: {
      lockerId: "",
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
      status: "",
      idProof: ""
    },
    maintenanceDate: defaultMaintenanceDate,
    description: "yes",
    maintenanceCost: maintenanceCost,
    status: "pending"
  });

  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [checkboxError, setCheckboxError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const customerId = sessionStorage.getItem("id");

    if (customerId) {
      const fetchLockerData = async () => {
        try {
          const response = await axios.get(`http://localhost:2026/locker/customer/${customerId}`);
          console.log("Fetched locker data:", response.data);
          const lockerData = response.data;

          setInputData(prevState => ({
            ...prevState,
            lockerId: lockerData,
            maintenanceCost: getMaintenanceCost(lockerData.lockerSize)
          }));
        } catch (err) {
          console.error("Error fetching locker data:", err);
        }
      };

      fetchLockerData();
    }
  }, []);

  const getMaintenanceCost = (lockerSize) => {
    switch (lockerSize) {
      case 'small':
        return 100;
      case 'medium':
        return 150;
      case 'large':
        return 200;
      case 'extra_large':
        return 250;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submit:", inputData);

    if (!isAcknowledged) {
      setCheckboxError('Please click the checkbox to proceed.');
      return;
    }

    setCheckboxError('');
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:2026/maintenance", inputData);
      setOpen(true);
      console.log("Maintenance added successfully:", response.data);
      sessionStorage.setItem("maintenanceCost", inputData.maintenanceCost);

      setMessage('Maintenance added successfully.');

      navigate('/payment');
    } catch (err) {
      console.error("Error adding maintenance:", err.response ? err.response.data : err.message);
      setMessage(err.response ? err.response.data.message : 'Maintenance registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <UserHeader />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <ProgressStepBar currentStep={3} />
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
          <h2 className="text-3xl font-bold mb-6 text-center">Maintenance for Locker</h2>
          <div className="mb-6">
            <p className="text-lg text-gray-700">
              The Maintenance Date for Your Locker is <strong>{defaultMaintenanceDate}</strong> and the maintenance cost for the Locker that you have chosen is <strong>{maintenanceCost}</strong>.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              The Maintenance Cost will be added on your Payment for the Locker.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              Please Click the Below button to proceed to the Payment.
            </p>
            <br />
            <br />

            <div className="flex items-center mb-4">
              <input
                id="acknowledge"
                type="checkbox"
                checked={isAcknowledged}
                onChange={() => setIsAcknowledged(!isAcknowledged)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="acknowledge" className="ml-2 text-gray-700">
                I Acknowledge for the maintenance cost to be added in the Payment
              </label>
            </div>
            {checkboxError && <p className="text-red-500 text-xs mt-1">{checkboxError}</p>}

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
