import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserHeader from "../UserHeader/UserHeader";

function LockerDashboard() {
    const [approvedCount, setApprovedCount] = useState(0);
    const [smallCount, setSmallCount] = useState(0);
    const [mediumCount, setMediumCount] = useState(0);
    const [largeCount, setLargeCount] = useState(0);
    const [extraLargeCount, setExtraLargeCount] = useState(0);
    const [locationCounts, setLocationCounts] = useState({});
    const [totalLockers, setTotalLockers] = useState(50);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const approvedResponse = await axios.get("http://localhost:2026/locker/getapproveCount");
                setApprovedCount(Number(approvedResponse.data) || 0);

                const [smallResponse, mediumResponse, largeResponse, extraLargeResponse] = await Promise.all([
                    axios.get("http://localhost:2026/locker/getsmallCount"),
                    axios.get("http://localhost:2026/locker/getmediumCount"),
                    axios.get("http://localhost:2026/locker/getlargeCount"),
                    axios.get("http://localhost:2026/locker/getextralargeCount")
                ]);

                setSmallCount(Number(smallResponse.data) || 0);
                setMediumCount(Number(mediumResponse.data) || 0);
                setLargeCount(Number(largeResponse.data) || 0);
                setExtraLargeCount(Number(extraLargeResponse.data) || 0);

                const [maduraiResponse, dindigulResponse, coimbatoreResponse, trichyResponse, tanjoreResponse,
                    chennaiResponse, salemResponse, karurResponse, thirunelveliResponse, kovilpattiResponse,
                    tuticorinResponse] = await Promise.all([
                        axios.get("http://localhost:2026/locker/getmaduraiCount"),
                        axios.get("http://localhost:2026/locker/getdindigulCount"),
                        axios.get("http://localhost:2026/locker/getcoimbatoreCount"),
                        axios.get("http://localhost:2026/locker/gettrichyCount"),
                        axios.get("http://localhost:2026/locker/gettanjoreCount"),
                        axios.get("http://localhost:2026/locker/getchennaiCount"),
                        axios.get("http://localhost:2026/locker/getsalemCount"),
                        axios.get("http://localhost:2026/locker/getkarurCount"),
                        axios.get("http://localhost:2026/locker/getthirunelveliCount"),
                        axios.get("http://localhost:2026/locker/getkovilpattiCount"),
                        axios.get("http://localhost:2026/locker/gettuticorinCount")
                    ]);

                setLocationCounts({
                    Madurai: Number(maduraiResponse.data) || 0,
                    Dindigul: Number(dindigulResponse.data) || 0,
                    Coimbatore: Number(coimbatoreResponse.data) || 0,
                    Trichy: Number(trichyResponse.data) || 0,
                    Tanjore: Number(tanjoreResponse.data) || 0,
                    Chennai: Number(chennaiResponse.data) || 0,
                    Salem: Number(salemResponse.data) || 0,
                    Karur: Number(karurResponse.data) || 0,
                    Thirunelveli: Number(thirunelveliResponse.data) || 0,
                    Kovilpatti: Number(kovilpattiResponse.data) || 0,
                    Tuticorin: Number(tuticorinResponse.data) || 0
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const totalSizeCount = 20;
    const remainingSmall = totalSizeCount - smallCount;
    const remainingMedium = totalSizeCount - mediumCount;
    const remainingLarge = totalSizeCount - largeCount;
    const remainingExtraLarge = totalSizeCount - extraLargeCount;

    const remainingLockers = totalLockers - approvedCount;

    const totalLocationCount = 10;
    const remainingLocations = Object.fromEntries(
        Object.entries(locationCounts).map(([location, count]) => [location, totalLocationCount - count])
    );

    return (
        <>
            <UserHeader />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800">Available Total Lockers</h2>
                        <p className="text-4xl font-semibold text-gray-600 mt-2">{remainingLockers}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Locker Sizes</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Small</span>
                                    <span className="text-gray-600">{remainingSmall}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Medium</span>
                                    <span className="text-gray-600">{remainingMedium}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Large</span>
                                    <span className="text-gray-600">{remainingLarge}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Extra Large</span>
                                    <span className="text-gray-600">{remainingExtraLarge}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Locations</h2>
                            <div className="space-y-2">
                                {Object.entries(remainingLocations).map(([location, remainingCount]) => (
                                    <div key={location} className="flex justify-between">
                                        <span className="text-gray-700">{location}</span>
                                        <span className="text-gray-600">{remainingCount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-red-500 text-white rounded-lg">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="mt-4 p-4 bg-blue-500 text-white rounded-lg">
                            Loading...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default LockerDashboard;
