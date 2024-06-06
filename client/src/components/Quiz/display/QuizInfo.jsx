import React from "react";

const QuizInfo = ({ quiz, handleStatusChange }) => {
  return (
    <div className="mt-4 space-y-2">
      <p>
        <strong>Name:</strong> {quiz.name}
      </p>
      <p>
        <strong>Duration:</strong> {quiz.duration} minutes
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
            quiz.isPublished ? "bg-rose-500" : "bg-green-500"
          } ${
            quiz.isPublished ? "hover:bg-rose-600" : "hover:bg-green-600"
          } rounded transition duration-300 ease-in-out`}
          onClick={handleStatusChange}>
          {quiz.isPublished ? "Hide Quiz" : "Make Public"}
        </button>
      </div>
    </div>
  );
};

export default QuizInfo;
