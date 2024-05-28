import React from "react";

const Input = ({ title, ...props }) => {
  return (
    <div className="mt-3">
      <input {...props} className="" required placeholder={title} />
    </div>
  );
};

export default Input;
