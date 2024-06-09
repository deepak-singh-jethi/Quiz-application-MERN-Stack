import React, { memo } from "react";

const QuizInput = memo(
  ({ label, name, value, onChange, type = "text", ...props }) => (
    <div className="md:mb-6 mb-3">
      <label
        htmlFor={name}
        className="block text-sm md:text-md font-semibold text-gray-700 my-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1 px-2 md:py-2 md:px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      />
    </div>
  )
);

export default memo(QuizInput);
