import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";

function ViewPayment() {
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    axios
      .get("http://localhost:2026/payment/all")
      .then((response) => {
        if (response.data.length > 0) {
          setColumns(Object.keys(response.data[0]));
        }
        setRecords(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleDelete = (recordId) => {
    const conf = window.confirm("Do you want to delete this record?");
    if (conf) {
      axios
        .delete(`http://localhost:2026/payment/${recordId}`)
        .then(() => {
          alert("Record has been deleted");
          setRecords(records.filter(record => record.recordId !== recordId));
        })
        .catch((err) => console.error("Error deleting record:", err));
    }
  };
  const sortedRecords = [...records].sort((a, b) => {
    const idA = typeof a.paymentId === 'string' ? parseFloat(a.paymentId) : a.paymentId;
    const idB = typeof b.paymentId === 'string' ? parseFloat(b.paymentId) : b.paymentId;
    return idB - idA;
  });

  const filteredRecords = sortedRecords.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 pt-16">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for payment records..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecords.map((d) => (
            <div key={d.recordId} className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <div className="text-lg font-semibold text-gray-800">Payment ID: {d.paymentId}</div>
                <div className="text-sm text-gray-600">Payment Date: {d.paymentDate}</div>
                <div className="text-sm text-gray-600">Amount: {d.amount}</div>
                <div className="text-sm text-gray-600">Payment Method: {d.paymentMethod}</div>
                <div className="text-sm text-gray-600">Payment Status: {d.status}</div>
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

export default ViewPayment;
