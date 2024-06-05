import React from "react";

const Button1 = ({ children, ...props }) => {
  return (
    <button
      className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-4 rounded transition duration-300 ease-in-out hover:from-blue-600 hover:to-teal-500 min-w-[120px] w-fit"
      {...props}>
      {children}
    </button>
  );
};

export default Button1;
