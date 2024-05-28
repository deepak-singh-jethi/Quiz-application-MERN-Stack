import React from "react";

const Button = ({ children }) => {
  return (
    <div className="w-full text-center">
      <button className="my-4 bg-[#D9D9DA] rounded-full px-6 py-2 hover:bg-gray-300 hover:text-gray-800">
        {children}
      </button>
    </div>
  );
};

export default Button;
