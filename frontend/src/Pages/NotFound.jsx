import React, { useEffect } from "react";
import food from "../assets/Images/food404.png";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate(); // Hook to access the navigation function

  const handleGoBack = () => {
    navigate(-3); // Go back 3 steps in history
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/"); // Redirect to homepage after 5 seconds
    }, 3000); // 5000 ms = 5 seconds
  
    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-stretch">
      <div className="container flex flex-col items-center justify-center px-5 text-gray-700">
        <div className="md:flex md:flex-row md:items-center md:justify-center">
          <div className="max-w-md mb-8 md:mb-0">
            <div className="text-7xl font-dark font-[Merriweather] font-bold text-red-700">404</div>
            <p className="text-2xl mt-8 mb-8 md:text-3xl font-[Merriweather] font-light leading-normal">
              Sorry! <br /> we couldn't find this page.
            </p>
            <p className="mt-8 mb-8 hidden md:block">
              But don't worry, you'll be redirected to the homepage shortly.
            </p>
            <Link
              to="/"
              className="inline-flex items-center hidden md:inline bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white transition-all"
            >
              Back To Homepage
            </Link>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center hidden md:inline ml-4 bg-gray-300 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-black transition-all"
            >
              Go Back
            </button>
          </div>

          <div className="md:ml-8">
            <img src={food} alt="404 food" />
          </div>
        </div>

        {/* Text and Button for smaller screens, displayed below the image */}
        <div className="mt-8 text-center md:hidden">
          <p className="mt-8 mb-8">
            But don't worry, you'll be redirected to the homepage shortly.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white transition-all"
          >
            Back To Homepage
          </Link>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center mt-4 bg-gray-300 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-black transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
