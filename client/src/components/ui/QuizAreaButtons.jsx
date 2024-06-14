import React, { memo } from "react";

const QuizAreaButtons = ({
  title,
  handleState,
  stateValue,
  selectedQuizArea,
}) => {
  return (
    <button
      className={`text-white text-xs sm:text-sm md:text-md font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
        ${
          selectedQuizArea === stateValue
            ? "bg-gray-800 hover:bg-gray-900"
            : "bg-gray-600 hover:bg-gray-700"
        } ${
        selectedQuizArea === stateValue
          ? "active:bg-gray-900"
          : "active:bg-gray-800"
      }`}
      onClick={handleState}>
      {title}
    </button>
  );
};

export default memo(QuizAreaButtons);
