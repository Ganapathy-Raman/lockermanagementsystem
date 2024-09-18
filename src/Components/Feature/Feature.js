import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Feature = () => {
    const [counts, setCounts] = useState({
        lockers: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [lockersResponse, pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
                    axios.get("http://localhost:2026/locker/getlockerCount"),
                    axios.get("http://localhost:2026/locker/getpendingCount"),
                    axios.get("http://localhost:2026/locker/getapproveCount"),
                    axios.get("http://localhost:2026/locker/getrejectedCount")
                ]);

                setCounts({
                    lockers: lockersResponse.data,
                    pending: pendingResponse.data,
                    approved: approvedResponse.data,
                    rejected: rejectedResponse.data
                });
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);
    const barData = {
        labels: ['Lockers', 'Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Counts',
                data: [counts.lockers, counts.pending, counts.approved, counts.rejected],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
            }
        },
        maintainAspectRatio: false,
    };

    const pieData = {
        labels: ['Lockers', 'Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Counts',
                data: [counts.lockers, counts.pending, counts.approved, counts.rejected],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
            }
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="p-4">
            <div className="flex flex-row flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-0 w-full sm:w-1/2 md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center min-h-[200px]">
                    <h2 className="text-xl font-semibold mb-2">Locker Request</h2><br />
                    <p className="text-3xl font-bold">{counts.lockers}</p>
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-1/2 md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center min-h-[200px]">
                    <h2 className="text-xl font-semibold mb-2">Pending Request</h2><br />
                    <p className="text-3xl font-bold">{counts.pending}</p>
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-1/2 md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center min-h-[200px]">
                    <h2 className="text-xl font-semibold mb-2">Approved Request</h2><br />
                    <p className="text-3xl font-bold">{counts.approved}</p>
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-1/2 md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center min-h-[200px]">
                    <h2 className="text-xl font-semibold mb-2">Rejected Request</h2><br />
                    <p className="text-3xl font-bold">{counts.rejected}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-4 h-72 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Bar Graph</h2>
                    <div className="flex-1 overflow-auto">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-4 h-72 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Pie Chart</h2>
                    <div className="flex-1 overflow-auto">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feature;
