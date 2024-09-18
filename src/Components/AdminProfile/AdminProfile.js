import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

function AdminProfile() {
    const [api, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await axios.get('http://localhost:2026/api/12');
                setApi(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching api data:', err);
                setError('Error fetching api data');
                setLoading(false);
            }
        };

        fetchApi();
    }, []);

    const handleGoBack = () => {
        navigate('/adminDashboard');
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <>
            <Header />
            <div className="container mx-auto p-6">
                <div className="flex justify-center">
                    {api ? (
                        <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-6">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&s"
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{api.customerName}</h2>
                                <p className="text-gray-600 mb-2">Email: {api.email}</p>
                                <p className="text-gray-600 mb-2">Date of Birth: {api.dateOfBirth}</p>
                                <p className="text-gray-600 mb-2">Gender: {api.gender}</p>
                                <p className="text-gray-600 mb-2">Address: {api.address}</p>
                                <p className="text-gray-600 mb-4">Phone Number: {api.phoneNo}</p>
                                <button
                                    onClick={handleGoBack}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">No api data available</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminProfile;
