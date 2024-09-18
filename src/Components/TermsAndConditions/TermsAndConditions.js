import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from "../UserHeader/UserHeader";

const TermsAndConditions = () => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    setIsAcknowledged(e.target.checked);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (isAcknowledged) {
      navigate('/locker');
    }
  };

  return (
    <>
      <UserHeader />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Locker Sizes Available</h2>
                  <ul className="list-disc pl-5">
                    <li>Small</li>
                    <li>Medium</li>
                    <li>Large</li>
                    <li>Extra Large</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    We offer a variety of locker sizes to suit your storage needs. Whether you need a small locker for personal items or an extra large locker for bulkier belongings, we have the right option for you.
                  </p>
                </div>
                <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Rental Fee</h2>
                  <ul className="list-disc pl-5">
                    <li>Small: Rs.1000</li>
                    <li>Medium: Rs.2000</li>
                    <li>Large: Rs.3000</li>
                    <li>Extra Large: Rs.4000</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    The rental fee varies depending on the size of the locker. Choose the size that best fits your needs and budget. Our competitive pricing ensures you get the best value for your storage requirements.
                  </p>
                </div>
                <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Maintenance Cost</h2>
                  <p className="text-xl font-semibold">Default Cost: Rs.150</p>
                  <p className="mt-4 text-gray-700">
                    This is the default cost for all locker sizes and it will not vary based on locker sizes.                </p>

                  <p className="mt-4 text-gray-700">
                    A standard maintenance fee is applied to ensure the locker remains in good condition. This cost helps us provide high-quality and well-maintained facilities for all our customers.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <p className="text-gray-700">
                  By renting a locker, you agree to abide by our terms and conditions. Please review all details carefully before making a decision. If you have any questions or need further assistance, feel free to contact our support team.
                </p>
              </div>
              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="acknowledgement"
                  checked={isAcknowledged}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="acknowledgement" className="text-sm">I acknowledge that I have read and agree to the terms and conditions.</label>
              </div>

              <button
                type="submit"
                onClick={handleProceed}
                disabled={!isAcknowledged}
                className={`w-full mt-4 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 ${!isAcknowledged ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Proceed
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default TermsAndConditions;