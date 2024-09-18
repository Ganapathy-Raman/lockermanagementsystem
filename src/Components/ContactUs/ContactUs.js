import React from "react";

function ContactUs() {
  return (
    <div className="bg-green-50 font-sans lg:h-screen flex items-center justify-center">
      <div className="grid lg:grid-cols-3 gap-6 p-8 lg:p-12 max-lg:justify-center w-full max-w-7xl mx-auto">
        <div className="max-w-lg mx-auto lg:mx-0 lg:text-left lg:mb-0 mb-6">
          <h2 className="text-4xl font-extrabold text-gray-800" role="text">
            Want to know more about Locker Management
          </h2>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed" role="con">
            You can request Locker in our ABC Bank. Please feel free to contact us.
          </p>
          <form className="mt-8 bg-white rounded-lg p-6 shadow-md space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md h-12 px-6 bg-gray-100 text-sm outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-md h-12 px-6 bg-gray-100 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full rounded-md h-12 px-6 bg-gray-100 text-sm outline-none"
            />
            <textarea
              placeholder="Description"
              rows="6"
              className="w-full rounded-md px-6 bg-gray-100 text-sm pt-3 outline-none"
            ></textarea>
            <button
              type="button"
              className="text-gray-800 bg-green-200 hover:bg-green-300 font-semibold rounded-md text-sm px-6 py-3 w-full"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="relative lg:col-span-2 flex items-center justify-center">
          <img
            src="https://readymadeui.com/images/analtsis.webp"
            alt="Organ Donation"
            className="w-full h-auto max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
