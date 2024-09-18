import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OtpModal from '../OTPModal/OTPModal'; 
import UserHeader from "../UserHeader/UserHeader";
import ProgressStepBar from "../ProgressStepBar/ProgressStepBar";
import Swal from "sweetalert2";
import { FaCalendarAlt, FaDollarSign, FaCreditCard, FaRegCreditCard, FaKey, FaBuilding, FaPaypal } from "react-icons/fa";

const Payment = () => {
  const [paymentData, setPaymentData] = useState({
    agreementId: "",
    paymentDate: new Date().toISOString().split('T')[0],
    amount: "0",
    paymentMethod: "credit/debit card",
    cardNumber: "",
    cvv: "",
    expirationDate: "",
    cardPin: "",
    upiId: "",
    upiPin: "",
    accountNo: "",
    bankPin: "",
    status: "paid"
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAgreementId = sessionStorage.getItem("agreementId");
    const rentalFee = parseFloat(sessionStorage.getItem("rentalFee") || "0");
    const maintenanceCost = parseFloat(sessionStorage.getItem("maintenanceCost") || "0");

    if (storedAgreementId) {
      setPaymentData(prevState => ({
        ...prevState,
        agreementId: storedAgreementId,
        amount: (rentalFee + maintenanceCost).toFixed(2)
      }));
    }
  }, []);

  const openModal = () => {
    if (handleValidation()) {
      setIsModalOpen(true);
    } else {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatAccountNumber = (accountNumber) => {
    const cleaned = accountNumber.replace(/\D/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const validateCardNumber = (cardNumber) => {
    const cardNumberValue = cardNumber.replace(/\D/g, '');
    return cardNumberValue.length === 16;
  };

  const validateCvv = (cvv) => /^\d{3}$/.test(cvv);

  const validateExpirationDate = (expirationDate) => {
    const [month, year] = expirationDate.split('/');
    const expirationMonth = parseInt(month, 10);
    const expirationYear = parseInt(year, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return (
      expirationMonth >= 1 &&
      expirationMonth <= 12 &&
      expirationYear >= currentYear &&
      expirationYear <= 2040 &&
      (expirationYear > currentYear ||
        (expirationYear === currentYear && expirationMonth >= currentMonth))
    );
  };

  const validatePin = (pin) => /^\d{4}$/.test(pin);

  const handleValidation = () => {
    const validationErrors = {};
    if (paymentData.paymentMethod === "credit/debit card") {
      if (!validateCardNumber(paymentData.cardNumber)) validationErrors.cardNumber = "Card Number must be exactly 16 digits";
      if (!validateCvv(paymentData.cvv)) validationErrors.cvv = "CVV must be exactly 3 digits";
      if (!validateExpirationDate(paymentData.expirationDate)) validationErrors.expirationDate = "Expiration Date must be in MM/YYYY format and must be a future date";
      if (!validatePin(paymentData.cardPin)) validationErrors.cardPin = "PIN must be exactly 4 digits";
    }

    if (paymentData.paymentMethod === "upi") {
      if (!paymentData.upiId) validationErrors.upiId = "UPI ID is required";
      if (!paymentData.upiPin || !validatePin(paymentData.upiPin)) validationErrors.upiPin = "PIN must be exactly 4 digits";
    }

    if (paymentData.paymentMethod === "net banking") {
      if (!paymentData.accountNo) validationErrors.accountNo = "Account No is required";
      if (!paymentData.bankPin || !validatePin(paymentData.bankPin)) validationErrors.bankPin = "PIN must be exactly 4 digits";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    let updatedValue = value.replace(/\D/g, '');

    if (id === 'cardNumber') {
      updatedValue = formatCardNumber(value);
    } else if (id === 'accountNo') {
      updatedValue = formatAccountNumber(value);
    }

    setPaymentData(prevState => {
      const newState = { ...prevState, [id]: updatedValue };
      handleValidation(newState);
      return newState;
    });
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentData(prevState => {
      const newState = { ...prevState, paymentMethod: method };
      handleValidation(newState);
      return newState;
    });
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length <= 2) {
      formattedValue = value;
    } else if (value.length <= 4) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 6)}`;
    }

    const [month, year] = formattedValue.split('/').map(part => part.trim());
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum > 12) {
      formattedValue = `12/${year || ''}`;
    }

    if (yearNum > 2040) {
      formattedValue = `${month || ''}/2040`;
    }

    setPaymentData(prevState => {
      const newState = { ...prevState, expirationDate: formattedValue };
      handleValidation(newState);
      return newState;
    });
  };

  const handlePayNow = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed with the payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormVisible(true);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        const response = await axios.post("http://localhost:2026/payment", paymentData);

        const emailData = new FormData();
        emailData.append('from', 'noreply@yourdomain.com');
        emailData.append('to', sessionStorage.getItem('email'));
        emailData.append('subject', 'Payment Successful');
        emailData.append('body', `Dear ${sessionStorage.getItem('customername')},
        <p>Your payment of ${paymentData.amount} for a locker in our ABC Bank was successful. Thank you for your payment!</p>
        <p> Your Locker Request is in Pending State till Now . Once, the status is update from our side , we will notify you </p>
        <p> If your request is rejected , the amount that you have paid will be refunded in 2 days ! </p>
      <p>Feel free to contact us.</p>
      <p>Contact No : 9876543219</p>
      <p>Thank you for choosing our ABC Bank.</p>`);

        await axios.post("http://localhost:2026/locker/sendEmail", emailData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setTimeout(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Payment successful and email sent.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/feedback');
          });
        }, 10000);

      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response ? err.response.data.message : 'Payment registration failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  
  return (
    <>
      <UserHeader />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <ProgressStepBar currentStep={4} />
        {message && (
          <div className={`p-4 rounded mb-4 ${message.includes("failed") || message.includes("error") ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Form</h2>
          <div className="mb-6">
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 flex items-center">
              <FaCalendarAlt className="mr-2" /> Payment Date:
            </label>
            <input
              id="paymentDate"
              type="date"
              value={paymentData.paymentDate}
              readOnly
              className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 flex items-center">
              <FaDollarSign className="mr-2" /> Amount:
            </label>
            <input
              id="amount"
              type="text"
              value={paymentData.amount}
              readOnly
              className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {!formVisible && (
            <button
              type="button"
              onClick={handlePayNow}
              className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Pay Now
            </button>
          )}

          {formVisible && (
            <form onSubmit={handleSubmit}>
              <fieldset className="mb-6">
                <legend className="block text-sm font-medium text-gray-700 flex items-center">
                  <FaRegCreditCard className="mr-2" /> Payment Method:
                </legend>
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    value="credit/debit card"
                    checked={paymentData.paymentMethod === "credit/debit card"}
                    onChange={handlePaymentMethodChange}
                    className="mr-2"
                  />
                  <label htmlFor="creditCard" className="text-sm text-gray-700">Credit/Debit Card</label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentData.paymentMethod === "upi"}
                    onChange={handlePaymentMethodChange}
                    className="mr-2"
                  />
                  <label htmlFor="upi" className="text-sm text-gray-700">UPI</label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    id="netBanking"
                    name="paymentMethod"
                    value="net banking"
                    checked={paymentData.paymentMethod === "net banking"}
                    onChange={handlePaymentMethodChange}
                    className="mr-2"
                  />
                  <label htmlFor="netBanking" className="text-sm text-gray-700">Net Banking</label>
                </div>
              </fieldset>

              {paymentData.paymentMethod === "credit/debit card" && (
                <>
                  <div className="mb-6">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaCreditCard className="mr-2" /> Card Number:
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={handleChange}
                      maxLength={19}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaKey className="mr-2" /> CVV:
                    </label>
                    <input
                      id="cvv"
                      type="password"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      maxLength={3}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaCalendarAlt className="mr-2" /> Expiration Date (MM/YYYY):
                    </label>
                    <input
                      id="expirationDate"
                      type="text"
                      value={paymentData.expirationDate}
                      onChange={handleExpirationDateChange}
                      placeholder="MM/YYYY"
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="cardPin" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaKey className="mr-2" /> PIN:
                    </label>
                    <input
                      id="cardPin"
                      type="password"
                      value={paymentData.cardPin}
                      onChange={handleChange}
                      maxLength={4}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.cardPin && <p className="text-red-500 text-xs mt-1">{errors.cardPin}</p>}
                  </div>
                </>
              )}

              {paymentData.paymentMethod === "upi" && (
                <>
                  <div className="mb-6">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaPaypal className="mr-2" /> UPI ID:
                    </label>
                    <input
                      id="upiId"
                      type="text"
                      value={paymentData.upiId}
                      onChange={handleChange}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="upiPin" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaKey className="mr-2" /> PIN:
                    </label>
                    <input
                      id="upiPin"
                      type="password"
                      value={paymentData.upiPin}
                      onChange={handleChange}
                      maxLength={4}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.upiPin && <p className="text-red-500 text-xs mt-1">{errors.upiPin}</p>}
                  </div>
                </>
              )}

              {paymentData.paymentMethod === "net banking" && (
                <>
                  <div className="mb-6">
                    <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaBuilding className="mr-2" /> Account No:
                    </label>
                    <input
                      id="accountNo"
                      type="text"
                      value={paymentData.accountNo}
                      onChange={handleChange}
                      maxLength={19}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.accountNo && <p className="text-red-500 text-xs mt-1">{errors.accountNo}</p>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="bankPin" className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaKey className="mr-2" /> PIN:
                    </label>
                    <input
                      id="bankPin"
                      type="password"
                      value={paymentData.bankPin}
                      onChange={handleChange}
                      maxLength={4}
                      className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.bankPin && <p className="text-red-500 text-xs mt-1">{errors.bankPin}</p>}
                  </div>
                </>
              )}

              <button
              onClick={openModal} 
                type="submit"
                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Proceed to Payment
              </button>
            </form>
          )}
          <OtpModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
      </div>
    </>
  );
};

export default Payment;