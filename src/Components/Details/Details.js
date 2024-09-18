import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserHeader from '../UserHeader/UserHeader';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileImage, faFileAlt, faBell, faUser, faMailBulk, faCalendar, faMapMarkerAlt, faBoxOpen, faDollarSign, faWrench } from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Details() {
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
        Swal.fire({
            title: 'Thank You!',
            text: 'Thank you for requesting a locker in our bank.',
            icon: 'info',
            confirmButtonText: 'Go to Dashboard',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/customerDashboard');
            }
        });
    };

    const generatePDF = () => {
        const input = document.getElementById('card');
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('locker-details.pdf');
        });
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
    const qrData = {
        lockerId: locker?.lockerId,
        status: locker?.status
    };

    return (
        <>
            <UserHeader />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
                <div id="card" className="bg-white shadow-lg rounded-lg p-6 mb-4 max-w-md w-full relative">
                    <div className="text-center text-2xl font-bold mb-4">Summary of Details</div>

                    <QRCodeSVG value={JSON.stringify(qrData)} size={128} className="mb-4" />

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Customer Name: {locker.customerId.customerName}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faMailBulk} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Email: {locker.customerId.email}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Date Of Birth: {locker.customerId.dateOfBirth}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Address: {locker.customerId.address}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Belonging Type: {locker.belongingType}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Branch Location: {locker.location}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faBoxOpen} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Locker Size: {locker.lockerSize}</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Maintenance Date: 10-10-2024</p>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gray-600" />
                            <p className="text-gray-700">Payment Status: Paid</p>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            Go Back to Dashboard
                        </button>
                        <button
                            onClick={generatePDF}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                        >
                            Download as PDF
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default Details;