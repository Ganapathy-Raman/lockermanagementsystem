import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import Loader from '../Loader/Loader';
import Swal from 'sweetalert2';

function Feedback() {
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
        feedbackDate: "",
        rating: 0,
        comments: "",
        improvementNeeded: "",
        improvementDetails: "",
        impedimentsFaced: "",
        impedimentsDetails: ""
    });

    const [records, setRecords] = useState([]);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
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

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        setInputData(prevState => ({
            ...prevState,
            feedbackDate: getTodayDate()
        }));
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setInputData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setInputData(prevState => ({
            ...prevState,
            rating
        }));
    };

    const handleImprovementChange = (value) => {
        setInputData(prevState => ({
            ...prevState,
            improvementNeeded: value,
            improvementDetails: value === 'Yes' ? prevState.improvementDetails : ''
        }));
    };

    const handleImpedimentsChange = (value) => {
        setInputData(prevState => ({
            ...prevState,
            impedimentsFaced: value,
            impedimentsDetails: value === 'Yes' ? prevState.impedimentsDetails : ''
        }));
    };

    const validateValues = (data) => {
        const errors = {};

        if (!data.customerId.customerId) errors.customerId = "Please select a user id";
        if (!data.feedbackDate.trim()) errors.feedbackDate = "Please enter Feedback Date";
        if (!data.rating) errors.rating = "Please enter rating";
        if (!data.comments.trim()) errors.comments = "please enter comments";
        if (data.improvementNeeded === 'Yes' && !data.improvementDetails.trim()) {
            errors.improvementDetails = "Please describe the improvements needed";
        }

        if (data.impedimentsFaced === 'Yes' && !data.impedimentsDetails.trim()) {
            errors.impedimentsDetails = "Please describe the impediments faced";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data before submit:", inputData);

        const validationErrors = validateValues(inputData);
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:2026/feedback", inputData);
                setOpen(true);
                setLoading(false);
                Swal.fire({
                    title: 'Thanks for your valuable Feedback',
                    icon: 'success',
                    confirmButtonText: 'Go to Booking Details',
                    preConfirm: () => {
                        navigate('/details', { state: { feedbackData: inputData } });
                    }
                });
            } catch (err) {
                console.error("Error adding feedback:", err.response ? err.response.data : err.message);
                setMessage(err.response ? err.response.data.message : 'Feedback submission failed');
                setLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };
    const getStarClass = (star) => {
        return star <= inputData.rating ? 'text-yellow-500' : 'text-gray-300';
    };

    return (
        <>
            {loading && <Loader />}
            <UserHeader />
            <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
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
                    <h2 className="text-2xl font-bold mb-6 text-center">We are loved to hear your valuable feedback</h2>
                    <div className="text-center mb-6">
                        <img src="https://embedsocial.com/wp-content/uploads/2021/03/customer-survey-feedback-questions.jpg" alt="Feedback" className="mx-auto h-40 w-40 object-cover" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="feedbackDate"
                            value={inputData.feedbackDate}
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mt-4">Is any improvement needed from us?</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="improvementYes"
                                    name="improvementNeeded"
                                    value="Yes"
                                    checked={inputData.improvementNeeded === 'Yes'}
                                    onChange={(e) => handleImprovementChange(e.target.value)}
                                    className="mr-2"
                                    required
                                />
                                <label htmlFor="improvementYes" className="mr-4">Yes</label>

                                <input
                                    type="radio"
                                    id="improvementNo"
                                    name="improvementNeeded"
                                    value="No"
                                    checked={inputData.improvementNeeded === 'No'}
                                    onChange={(e) => handleImprovementChange(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="improvementNo">No</label>
                            </div>
                            {inputData.improvementNeeded === 'Yes' && (
                                <>
                                    <input
                                        type="text"
                                        value={inputData.improvementDetails}
                                        onChange={(e) => setInputData({ ...inputData, improvementDetails: e.target.value })}
                                        placeholder="Please describe the improvements needed"
                                        className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.improvementDetails && <p className="text-red-500 text-sm mt-1">{errors.improvementDetails}</p>}
                                </>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mt-4">Is there any impediment you faced while using this website?</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="impedimentYes"
                                    name="impedimentsFaced"
                                    value="Yes"
                                    checked={inputData.impedimentsFaced === 'Yes'}
                                    onChange={(e) => handleImpedimentsChange(e.target.value)}
                                    className="mr-2"
                                    required
                                />
                                <label htmlFor="impedimentYes" className="mr-4">Yes</label>

                                <input
                                    type="radio"
                                    id="impedimentNo"
                                    name="impedimentsFaced"
                                    value="No"
                                    checked={inputData.impedimentsFaced === 'No'}
                                    onChange={(e) => handleImpedimentsChange(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="impedimentNo">No</label>
                            </div>
                            {inputData.impedimentsFaced === 'Yes' && (
                                <>
                                    <input
                                        type="text"
                                        value={inputData.impedimentsDetails}
                                        onChange={(e) => setInputData({ ...inputData, impedimentsDetails: e.target.value })}
                                        placeholder="Please describe the impediments faced"
                                        className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.impedimentsDetails && <p className="text-red-500 text-sm mt-1">{errors.impedimentsDetails}</p>}
                                </>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mt-4">How would you rate the quality of our service?</label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className={`text-3xl ${getStarClass(star)}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mt-4">
                                Comments:
                            </label>
                            <input
                                id="comments"
                                type="text"
                                value={inputData.comments}
                                onChange={(e) => setInputData({ ...inputData, comments: e.target.value })}
                                className="mt-2 block w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments}</p>}
                        </div>

                        <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Feedback;
