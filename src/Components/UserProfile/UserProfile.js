import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../UserHeader/UserHeader';

function UserProfile() {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageSrc, setImageSrc] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&s');
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();

    const id = sessionStorage.getItem("id");
    console.log(id);

    useEffect(() => {
        if (!id) {
            setError('No user ID found in session storage.');
            setLoading(false);
            return;
        }

        const loadAllUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:2026/api/${id}`);
                setForm(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching API data:', err);
                setError('Error fetching API data');
                setLoading(false);
            }
        };

        loadAllUsers();
    }, [id]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageSrc = reader.result;
                setImageSrc(newImageSrc);
                setImageUploaded(true);
                localStorage.setItem('profileImage', newImageSrc);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGoBack = () => {
        navigate('/customerDashboard');
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <>
            <UserHeader />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                {form ? (
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="flex justify-center p-4">
                            <img
                                src={imageSrc}
                                alt="Profile"
                                className={`w-32 h-32 object-cover rounded-full ${imageUploaded ? 'border-4 border-blue-500' : ''}`}
                            />
                        </div>
                        <div className="p-6">
                            {!imageUploaded && (
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mb-4 w-full text-gray-700 border border-gray-300 rounded-md"
                                />
                            )}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">{form.customerName}</h2>
                                <p className="text-gray-700 mb-2">Email: {form.email}</p>
                                <p className="text-gray-700 mb-2">Date of Birth: {form.dateOfBirth}</p>
                                <p className="text-gray-700 mb-4">Gender: {form.gender}</p>
                                <button
                                    onClick={handleGoBack}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No API data available</p>
                )}
            </div>
        </>
    );
}

export default UserProfile;
