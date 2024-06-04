import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] min-w-[300px] h-full bg-gray-200 rounded-md shadow-md p-4">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500 mb-4" />
      <p className="text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;
