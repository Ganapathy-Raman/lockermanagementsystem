import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewCustomerLocker() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("All");
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

  const sortedRecords = [...records].sort((a, b) => b.lockerId - a.lockerId);

  const filteredRecords = sortedRecords.filter((record) => {
    const matchesSearch = Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSize = selectedSize === "All" || record.lockerSize === selectedSize;
    const matchesLocation = selectedLocation === "All" || record.location === selectedLocation;

    return matchesSearch && matchesSize && matchesLocation;
  });

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
      <div className="container mx-auto p-6 pt-16">
        <div className="flex justify-between mb-8 space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for available lockers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
            >
              <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4zm8 14h-2v-1h2v1zm-4 0h-2v-1h2v1z" />
            </svg>
          </div>
          <div className="relative flex-1">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="All">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra_large">Extra Large</option>
            </select>
          </div>
          <div className="relative flex-1">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <option value="All">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {currentRecords.map((d, i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <div className="text-lg font-semibold text-gray-800">Locker</div>
                <div className="text-sm text-gray-600">Locker Size: {d.lockerSize}</div>
                <div className="text-sm text-gray-600">Location: {d.location}</div>
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

export default ViewCustomerLocker;
