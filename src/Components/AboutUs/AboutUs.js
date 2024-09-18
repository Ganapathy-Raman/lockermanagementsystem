import React from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="space-y-6">
              <div className="sec-title">
                <span className="block text-blue-600 text-lg font-semibold">About Our Locker Management System</span>
                <h2 className="text-3xl font-extrabold text-gray-800">Efficient and Secure Locker Solutions</h2>
              </div>
              <p className="text-gray-600 text-base">
                Our locker management system is designed to provide secure and efficient storage solutions for businesses and individuals. We ensure that your valuable items are protected and easily accessible whenever you need them.
              </p>
              <p className="text-gray-600 text-base">
                <strong>Why Choose Us?</strong> Our system offers advanced security features, easy-to-use interfaces, and reliable access controls to ensure the safety and management of your lockers.
              </p>
              <div className="btn-box">
                <Link
                  to="/login"
                  className="inline-block bg-blue-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 flex items-center justify-center">
            <img
              src="https://media.istockphoto.com/id/521303664/photo/safe-deposit-boxes-with-open-one-cell.jpg?s=612x612&w=0&k=20&c=-9wNGxVW51s3FWoyuLz0asneBVwPzpUaXi7q1Zi7NEk="
              alt="Locker Management System"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="text-center mt-12">
          <span className="block text-blue-600 text-lg font-semibold">Our Vision</span>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">A Secure Locker Solution for Every Business</h2>
          <p className="text-gray-600 text-base mt-4">
            <strong>Meeting the Growing Demand:</strong>
            <br />
            As businesses and individuals increasingly seek secure storage solutions, our goal is to provide innovative and adaptable locker systems that meet diverse needs and expectations.
            <br />
            We are committed to continuously enhancing our technology and services to ensure the highest level of security and convenience for all our users.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
