import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserHeader from '../UserHeader/UserHeader';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileImage, faFileAlt, faBell } from '@fortawesome/free-solid-svg-icons';

function Notification() {
    const [locker, setLocker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = sessionStorage.getItem("id");

        const fetchLocker = async () => {
            try {
                const response = await axios.get(`http://localhost:2026/locker/customer/${userId}`);
                const fetchedLocker = response.data;

                if (locker && JSON.stringify(fetchedLocker) !== JSON.stringify(locker)) {
                    if (fetchedLocker.status === 'Approved' || fetchedLocker.status === 'Rejected') {
                        toast.success(`Your Locker Request has been ${fetchedLocker.status.toLowerCase()}!`);
                        let currentCount = parseInt(sessionStorage.getItem('notificationCount'), 10) || 0;
                        currentCount += 1; 
                        sessionStorage.setItem('notificationCount', currentCount);
                        setNotificationCount(currentCount); 
                    }
                }

                setLocker(fetchedLocker);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching locker data:', err);
                setError('Error fetching locker data');
                setLoading(false);
            }
        };

        fetchLocker();
    }, [locker]);

    const handleGoBack = () => {
        navigate('/customerDashboard');
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const viewMd = (idProof) => {
        if (idProof) {
            Swal.fire({
                title: 'ID Proof',
                imageUrl: `data:image/jpeg;base64,${idProof}`,
                imageWidth: 400,
                imageHeight: 300,
                imageAlt: "ID Proof"
            });
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType && fileType.includes('image')) {
            return faFileImage;
        } else if (fileType && fileType.includes('pdf')) {
            return faFilePdf;
        } else {
            return faFileAlt;
        }
    };

    return (
        <>
            <UserHeader />
            <div className="p-6 bg-gray-100 min-h-screen">
                {locker ? (
                    <div className="relative bg-white shadow-lg rounded-lg p-6 mb-4">
                        <div className="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded">
                            Paid
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {locker.lockerName}
                                    {locker.status === 'Approved' && <span className="ml-2 text-green-500">Approved</span>}
                                    {locker.status === 'Rejected' && <span className="ml-2 text-red-500">Rejected</span>}
                                    {locker.status === 'pending' && <span className="ml-2 text-orange-500">Pending</span>}
                                </h2>
                            </div>
                            <p className="text-gray-700">Customer Name: {locker.customerId.customerName}</p>
                            <p className="text-gray-700">Email: {locker.customerId.email}</p>
                            <p className="text-gray-700">Address: {locker.customerId.address}</p>
                            <p className="text-gray-700">Locker: {locker.lockerId}</p>
                            <p className="text-gray-700">Belonging Type: {locker.belongingType}</p>
                            <p className="text-gray-700">Branch Location: {locker.location}</p>
                            <p className="text-gray-700">Locker Size: {locker.lockerSize}</p>
                            <p className="text-gray-700">Locker Status: {locker.status}</p>
                            <p className="text-gray-700">
                                ID Proof:
                                <button 
                                    onClick={() => viewMd(locker.idProof)} 
                                    className="ml-2 text-blue-500 hover:underline"
                                >
                                    <FontAwesomeIcon icon={getFileIcon(locker.idProof)} size="lg" />
                                </button>
                            </p>
                            <p className="text-gray-700">Maintenance Date : 10-10-2024</p>
                            <p className="text-gray-700">Payment Status: Paid</p>
                            <button 
                                onClick={handleGoBack} 
                                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No Customer data available</p>
                )}
                
                <ToastContainer />
            </div>
        </>
    );
}

export default Notification;
