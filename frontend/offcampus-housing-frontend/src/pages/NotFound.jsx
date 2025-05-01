

import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Container for the 404 message */}
      <div className="text-center">
        {/* Main text message */}
        <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
        <p className=" font-bold text-2xl text-black-700 mb-6">Sorry, this URL is not part of OffCampus Housing website.</p>

       {/* Image to accompany the 404 message */}
       <img
          src="https://images.vexels.com/media/users/3/128332/isolated/preview/13bcbc98044bbd2bd1d614b83db76de7-oops-bubble-svg.png"
          alt="OOPS"
          className="rounded-lg shadow-lg mb-6 max-w-full h-auto"
        />
        {/* Button to redirect to the homepage */}
        <a
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
