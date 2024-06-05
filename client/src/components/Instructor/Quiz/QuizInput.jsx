import React, { memo } from "react";

const QuizInput = memo(({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
));

export default QuizInput;
