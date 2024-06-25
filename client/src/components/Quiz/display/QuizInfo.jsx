import React, { memo } from "react";

const QuizInfo = ({ quiz, handleStatusChange, handleQuizFreeOrNot }) => {
  const hours = Math.floor(quiz.duration / 60);
  const minutes = quiz.duration % 60;
  return (
    <>
      <div className="mt-4 space-y-2">
        {/*All quiz quiz info */}
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
        {/* buttons */}
        <div className="w-full flex flex-wrap justify-between pt-6">
          {/* change quiz status Active on hidden based on the value of quiz.isPublished */}
          <button
            className={`md:py-2 py-1 px-1 md:px-3  ${
              quiz.isPublished ? "bg-[#EF4443] text-white" : "bg-green-500"
            } ${
              quiz.isPublished ? "hover:bg-[#c83838] " : "hover:bg-[#3aba6b]"
            } rounded transition duration-300 ease-in-out text-white text-sm md:text-md`}
            onClick={handleStatusChange}>
            {quiz.isPublished ? "Mark as Not Ready" : "Mark as Ready to use"}
          </button>
          {/* change quiz free or not based on the value of quiz.isFree */}
          {quiz.isPublished && (
            <button
              className={`py-1 md:px-3 px-1  ${
                quiz.isFree ? "bg-[#EF4443] text-white" : "bg-green-500"
              } ${
                quiz.isFree ? "hover:bg-[#c83838] " : "hover:bg-[#3aba6b]"
              } rounded transition duration-300 ease-in-out text-white text-sm md:text-md`}
              onClick={handleQuizFreeOrNot}>
              {quiz.isFree ? "Make Premium" : "Make Quiz Free"}
            </button>
          )}
        </div>
      </div>
      {/* delete Quiz button */}
    </>
  );
};

export default memo(QuizInfo);
