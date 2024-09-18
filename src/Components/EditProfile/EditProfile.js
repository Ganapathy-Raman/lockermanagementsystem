import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserHeader from "../UserHeader/UserHeader";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [user, setUser] = useState({
        customerId: '',
        customerName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phoneNo: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const sessioncustomerId = sessionStorage.getItem("id");

        if (sessioncustomerId) {
            fetchUserData(sessioncustomerId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:2026/api/${id}`);
            const { customerId, customerName, email, dateOfBirth, gender, address, phoneNo, password } = response.data;

            setUser(prevState => ({
                ...prevState,
                customerId,
                customerName,
                email,
                dateOfBirth: dateOfBirth ? dateOfBirth.slice(0, 10) : '',
                gender,
                address,
                phoneNo,
                oldPassword: password
            }));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError('Error fetching user data');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        if (user.newPassword && user.newPassword !== user.confirmNewPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (user.newPassword === user.oldPassword) {
            setPasswordError('New password cannot be the same as the old password');
            return;
        }

        try {
            const updateData = {
                customerId: user.customerId,
                customerName: user.customerName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address,
                phoneNo: user.phoneNo,
                password: user.newPassword || user.oldPassword
            };

            const updateResponse = await axios.put('http://localhost:2026/api', updateData);

            if (updateResponse.data === "Good") {
                Swal.fire({
                    title: 'Profile updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/customerDashboard');
                    }
                });
            } else {
                setError('Error updating profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Error updating profile');
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <>
            <UserHeader className="sticky top-0 bg-white shadow-md z-10" />
            <div className="container mx-auto p-6 max-w-lg mt-16">
                <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={user.customerName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={user.dateOfBirth}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                        <textarea
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <textarea
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNo"
                            value={user.phoneNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Change Password</h2>
                        <button
                            type="button"
                            onClick={() => setShowNewPasswordFields(prev => !prev)}
                            className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {showNewPasswordFields ? 'Hide' : 'Update'}
                        </button>
                    </div>

                    <div className={`mb-4 ${showNewPasswordFields ? '' : 'hidden'}`}>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                name="oldPassword"
                                value={user.oldPassword}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(prev => !prev)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                            >
                                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className={`mb-4 ${showNewPasswordFields ? '' : 'hidden'}`}>
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={user.newPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className={`mb-4 ${showNewPasswordFields ? '' : 'hidden'}`}>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={user.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {passwordError && <p className="text-red-600 mb-4">{passwordError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProfile;
