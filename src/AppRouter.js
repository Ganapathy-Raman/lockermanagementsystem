import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerDashboard from './Components/CustomerDashboard/CustomerDashboard.js';
import Home from './Components/Home/Home';
import ContactUs from './Components/ContactUs/ContactUs';
import AboutUs from './Components/AboutUs/AboutUs';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Payment from './Components/Payment/Payment.js';
import ViewLocker from './Components/Locker/ViewLocker.js';
import Locker from './Components/Locker/Locker.js';
import ViewRentalAgreement from './Components/RentalAgreement/ViewRentalAgreement.js';
import RentalAgreement from './Components/RentalAgreement/RentalAgreement.js';
import ViewFeedback from './Components/Feedback/ViewFeedback.js';
import Maintenance from './Components/Maintenance/Maintenance.js';
import Error from './Components/Error/Error.js';
import UserProfile from './Components/UserProfile/UserProfile.js';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard.js';
import ViewMaintenance from './Components/Maintenance/ViewMaintenance.js';
import ViewPayment from './Components/Payment/ViewPayment.js';
import AdminProfile from './Components/AdminProfile/AdminProfile.js';
import EditProfile from './Components/EditProfile/EditProfile.js';
import EditLocker from './Components/Locker/EditLocker.js';
import ViewCustomerLocker from './Components/Locker/ViewCustomerLocker.js';
import Feedback from './Components/Feedback/Feedback.js';
import Notification from './Components/Notification/Notification.js';
import Details from './Components/Details/Details.js';
import TermsAndConditions from './Components/TermsAndConditions/TermsAndConditions.js';
import AvailableLockers from './Components/AvailableLockers/AvailableLockers.js';

function AppRouter() {
  return (
    <Router class="head">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/*" element={<Error />} />
        <Route path="/customerprofile" element={<UserProfile />} />
        <Route path="/locker" element={<Locker />} />
        <Route path="/rentalAgreement" element={<RentalAgreement />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/viewLocker" element={<ViewLocker />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/viewMaintenance" element={<ViewMaintenance />} />
        <Route path="/viewRentalAgreement" element={<ViewRentalAgreement />} />
        <Route path="/viewPayment" element={<ViewPayment />} />
        <Route path="/adminProfile" element={<AdminProfile />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/editLocker/:lockerId" element={<EditLocker />} />
        <Route path="/viewCustomerLocker" element={<ViewCustomerLocker />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/viewFeedback" element={<ViewFeedback />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/details" element={<Details />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/availableLockers" element={<AvailableLockers />} />
      </Routes>

    </Router>
  )
}

export default AppRouter;


