import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Header from "../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';

function ViewLocker() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    axios
      .get("http://localhost:2026/locker/all")
      .then((response) => {
        setRecords(response.data);
        console.log(JSON.stringify(response.data, null, 2));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const locations = [...new Set(records
    .map(record => record.location)
    .filter(location => location && location.trim() !== ""))];

  const sendEmailNotification = async (locker, status) => {
    const emailData = new FormData();
    emailData.append('from', 'noreply@yourdomain.com');
    emailData.append('to', locker.customerId.email);
    emailData.append('subject', `Your Request for a Locker for storage Has Been ${status === "Approved" ? "Approved" : "Rejected"}`);
    emailData.append('body', `
      <h1>Locker ${status === "Approved" ? "Approved" : "Rejected"}
      <p>Dear  ${locker.customerId.customerName} ,</p>
      <p>Your Request for a Locker for storage Has Been ${status} in  ${locker.location}</p>
      <p>You can now able to use locker in our ${locker.location} branch</p>
      <p>Details:</p>
      <ul>
        <li>Locker Size: ${locker.lockerSize}</li>
        <li>Location: ${locker.location}</li>
        <li>Belonging Type: ${locker.belongingType}</li>
        <li>Status: ${locker.status}</li>
      </ul>
      <p>Feel free to contact us.</p>
      <p>Contact No : 9876543219</p>
      <p>Thank you for choosing our ABC Bank.</p></h1>
    `);

    if (locker.idProof && locker.idProof instanceof File) {
      console.log('Attaching file:', locker.idProof);
      emailData.append('attachment', locker.idProof);
    } else {
      console.log('No valid file to attach.');
    }

    try {
      console.log('Sending email with data:', emailData);
      await axios.post("http://localhost:2026/locker/sendEmail", emailData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error("Error sending email:", emailError.response ? emailError.response.data : emailError.message);
      Swal.fire('Failed to send email');
    }
  };

  const approveRecord = async (lockerId) => {
    const updatedRecord = records.find(record => record.lockerId === lockerId);

    if (updatedRecord) {
      updatedRecord.status = "Approved";

      setRecords(records.map(record =>
        record.lockerId === lockerId ? updatedRecord : record
      ));

      try {
        const response = await axios.put('http://localhost:2026/locker', updatedRecord);
        console.log("Locker record updated:", response.data);
        Swal.fire("Locker record has been updated");
        await sendEmailNotification(updatedRecord, "Approved");
      } catch (err) {
        console.error("Error updating locker record:", err.response ? err.response.data : err.message);
        Swal.fire('Failed to update locker record');
      }
    }
  };

  const rejectRecord = async (lockerId) => {
    const updatedRecord = records.find(record => record.lockerId === lockerId);

    if (updatedRecord) {
      updatedRecord.status = "Rejected";

      setRecords(records.map(record =>
        record.lockerId === lockerId ? updatedRecord : record
      ));

      try {
        const response = await axios.put('http://localhost:2026/locker', updatedRecord);
        console.log("Locker record updated:", response.data);
        Swal.fire("Locker record has been updated");
        await sendEmailNotification(updatedRecord, "Rejected");
      } catch (err) {
        console.error("Error updating locker record:", err.response ? err.response.data : err.message);
        Swal.fire('Failed to update locker record');
      }
    }
  };

  const sortedRecords = [...records].sort((a, b) => b.lockerId - a.lockerId);

  const filteredRecords = sortedRecords.filter((record) => {
    const matchesSearch = Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSize = selectedSize === "All" || record.status === selectedSize;
    const matchesStatus = selectedStatus === "All" || record.lockerSize === selectedStatus;
    const matchesLocation = selectedLocation === "All" || record.location === selectedLocation;

    return matchesSearch && matchesSize && matchesStatus && matchesLocation;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const viewMd = (idProof) => {
    if (idProof) {
      const base64Image = `data:image/jpg;base64,${idProof}`;

      Swal.fire({
        title: 'Id Proof',
        imageUrl: base64Image,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: "Id Proof",
        didOpen: () => {
          const img = Swal.getPopup().querySelector('img');
          if (img) {
            img.onload = () => {
              console.log("Image loaded successfully");
            };
            img.onerror = () => {
              console.error("Image failed to load");
              Swal.fire('Failed to load image');
            };
          }
        }
      });
    } else {
      Swal.fire('No image data available');
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
      <Header className="sticky top-0 z-50" />
      <div className="container mx-auto p-6 pt-16">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for available lockers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-2/3 lg:w-1/2 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            viewBox="0 0 24 24"
          >
            <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4zm8 14h-2v-1h2v1zm-4 0h-2v-1h2v1z" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <label htmlFor="status-filter" className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              id="status-filter"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <label htmlFor="size-filter" className="block text-gray-700 font-medium mb-2">Size</label>
            <select
              id="size-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="All">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra_large">Extra Large</option>
            </select>
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <label htmlFor="location-filter" className="block text-gray-700 font-medium mb-2">Location</label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="All">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {currentRecords.map((d, i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <div className="text-lg font-semibold text-gray-800">Locker Size: {d.lockerSize}</div>
                <div className="text-sm text-gray-600">Locker ID: {d.lockerId}</div>
                <div className="text-sm text-gray-600">Customer Name: {d.customerId ? d.customerId.customerName : 'N/A'}</div>
                <div className="text-sm text-gray-600">Customer ID: {d.customerId ? d.customerId.customerId : 'N/A'}</div>
                <div className="text-sm text-gray-600">Location: {d.location}</div>
                <div className="text-sm text-gray-600">Belonging Type: {d.belongingType}</div>
                <div className="text-sm text-gray-600">Status: {d.status}</div>

                <button onClick={() => viewMd(d.idProof)} className="flex items-center text-blue-600 hover:text-blue-800">
                  <FontAwesomeIcon icon={getFileIcon(d.idProof)} size="lg" />
                  <span className="ml-2">Id Proof</span>
                </button>
                {d.status === "pending" && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                      title="Approve"
                      onClick={() => {
                        approveRecord(d.lockerId);
                        d.status = "Approved";
                        setRecords([...records]);
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                      title="Reject"
                      onClick={() => {
                        rejectRecord(d.lockerId);
                        d.status = "Rejected";
                        setRecords([...records]);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ml-2 hover:bg-gray-400 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default ViewLocker;
