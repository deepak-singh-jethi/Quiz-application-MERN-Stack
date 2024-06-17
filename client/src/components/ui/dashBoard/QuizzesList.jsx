import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { IoCalendarClearOutline } from "react-icons/io5";
import DashBoardHeadings from "./DashBoardHeading";

export const QuizzesList = ({ data, hideText }) => {
  const { role } = useContext(AuthContext);

  if (!data || !data.quiz || data.quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 text-center p-2 bg-gray-800 border border-gray-200 rounded-lg shadow-md w-full">
        <IoCalendarClearOutline className="text-6xl text-gray-400 mb-4" />
        <p className="text-lg">You haven't made any Quiz Free...</p>
        <Link
          to={`/${role}/quizzes/createQuiz`}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300">
          Create New Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className=" p-3 bg-gray-800 border border-gray-200 rounded-lg shadow-sm mt-4 w-full">
      <DashBoardHeadings
        heading="Free Quizzes"
        path="Show more.."
        link={`${role}/quizzes`}
        hideText={hideText}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {data.quiz.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:shadow-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-1">
                <img
                  src="https://dummyimage.com/50x50.png/09f/fff"
                  alt="Quiz image"
                  className="w-8  h-8  rounded-full object-cover mr-3"
                />
                <h3 className="md:text-lg text-md font-semibold text-gray-700">
                  {quiz.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Started at:</span>{" "}
                {new Date(quiz.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Topic: {quiz.topics.join(", ")}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Total Questions: {quiz.questions.length}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Attempted by: {quiz.numberOfStudents} Students
              </p>
              {quiz.createdBy.name && (
                <p className="text-xs text-gray-600 mb-1">
                  Created by: {quiz.createdBy.name}
                </p>
              )}
            </div>
            <div className="mt-1 text-center">
              <Link
                to={`/${role}/quizzes/${quiz.id}`}
                className="inline-block underline text-gray-700 text-sm md:text-md py-1 px-2 rounded-lg hover:text-blue-600 transition duration-200">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
