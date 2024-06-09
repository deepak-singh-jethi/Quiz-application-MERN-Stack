import React, { memo } from "react";

const QuizInfo = ({ quiz, handleStatusChange }) => {
  const hours = Math.floor(quiz.duration / 60);
  const minutes = quiz.duration % 60;
  return (
    <>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Name:</strong> {quiz.name}
        </p>
        <p>
          <strong>Duration:</strong> {hours} {hours <= 1 ? "Hour" : "Hours"}{" "}
          {minutes} {minutes <= 1 ? "Minutes" : "Minutes"}
        </p>
        <p>
          <strong>Per Question Marks:</strong> {quiz.perQusMarks}
        </p>
        <p>
          <strong>Topics:</strong> {quiz.topics.join(", ")}
        </p>
        <p>
          <strong>Total Questions:</strong> {quiz.questions.length}
        </p>
        {/* add a question button */}
        <div className="w-full flex justify-between pt-6">
          {/* change quiz status Active on hidden based on the value of quiz.isPublished */}
          <button
            className={`py-2 px-3  ${
              quiz.isPublished ? "bg-[#EF4443] text-white" : "bg-green-500"
            } ${
              quiz.isPublished ? "hover:bg-[#c83838] " : "hover:bg-[#3aba6b]"
            } rounded transition duration-300 ease-in-out text-white`}
            onClick={handleStatusChange}>
            {quiz.isPublished ? "Hide Quiz" : "Make Public"}
          </button>
        </div>
      </div>
      {/* delete Quiz button */}
    </>
  );
};

export default memo(QuizInfo);
