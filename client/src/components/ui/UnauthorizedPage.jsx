import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa"; // Importing an icon from react-icons

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-500 to-gray-700 p-4">
      <div className="max-w-lg w-full bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8 text-center text-white">
          <FaLock className="text-6xl mb-4 mx-auto text-red-500" />
          <h1 className="text-6xl font-extrabold">403</h1>
          <h2 className="mt-4 text-2xl font-bold">Unauthorized Access</h2>
          <p className="mt-2 text-gray-300">
            You do not have the necessary permissions to access this page.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105">
              Go to Homepage
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200 ease-in-out transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
