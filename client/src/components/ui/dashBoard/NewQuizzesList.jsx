import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { IoCalendarClearOutline } from "react-icons/io5";

import DashBoardHeadings from "./DashBoardHeading.jsx";

export const NewQuizzesList = ({ data }) => {
  const { role } = useContext(AuthContext);

  if (!data || !data.quiz || data.quiz.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 text-center p-6 bg-gray-800 border border-gray-200 rounded-lg shadow-md">
        <IoCalendarClearOutline className="text-6xl text-gray-400 mb-4" />
        <p className="text-lg">You don't have any live quizzes...</p>
        <Link
          to={`/${role}/quizzes/createQuiz`}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300">
          Create New Quiz
        </Link>
      </div>
    );

  return (
    <div className="md:p-6 p-3 bg-gray-800 border border-gray-200 rounded-lg shadow-sm mt-6 xl:w-fit w-full md:basis-3/4">
      {/* heading area */}
      <DashBoardHeadings
        heading="Ongoing Quizzes"
        path="Show more.."
        link="admin/quizzes"
      />

      {/* cards area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.quiz.map((quiz) => (
          // single card
          <div
            key={quiz.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:shadow-lg p-4">
            {/* image and title */}
            <div className="flex items-center mb-3">
              <img
                src="https://dummyimage.com/50.png/09f/fff"
                alt="Quiz image"
                className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover mr-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {quiz.name}
              </h3>
            </div>
            {/* details-1 started at */}
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Started at:</span>{" "}
              {new Date(quiz.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {/* details-2 topics */}
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Topic:</span>{" "}
              {quiz.topics.join(", ")}
            </p>
            {/* details-3 total questions and duration */}
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Total Questions:</span>{" "}
              {quiz.questions.length} ||{" "}
              <span className="font-semibold">Duration:</span> {quiz.duration}{" "}
              Hours
            </p>
            {/* details-4 attempted by */}
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Attempted by:</span>{" "}
              {quiz.numberOfStudents} Students
            </p>
            {/* start quiz button */}
            <div className="mt-2 text-right">
              <Link
                to={`${role}/quizzes/${quiz.id}`}
                className="inline-block bg-[#1F2937] text-white py-1 sm:py-2 sm:px-4 px-2 rounded-lg hover:bg-[#2d3642] transition duration-200">
                Quiz Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
