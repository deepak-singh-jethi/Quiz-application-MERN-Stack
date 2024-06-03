import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorBlock = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] min-w-[300px] h-full bg-red-200 rounded-md shadow-md p-4">
      <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
      <p className="text-lg text-red-700 mb-2">Something went wrong</p>
      <p className="text-sm text-red-600 mb-4">{message}</p>
    </div>
  );
};

export default ErrorBlock;
