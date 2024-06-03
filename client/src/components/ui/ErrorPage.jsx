import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Importing an icon from react-icons

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-600 to-gray-700 p-4">
      <div className="max-w-lg w-full bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8 text-center text-white">
          <FaExclamationTriangle className="text-6xl mb-4 mx-auto text-yellow-400" />
          <h1 className="text-6xl font-extrabold">404</h1>
          <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
          <p className="mt-2">
            Oops! The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105">
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
