import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { IoCalendarClearOutline } from "react-icons/io5";
import DashBoardHeadings from "./DashBoardHeading";

export const UpcomingQuizzes = ({ data, hideText }) => {
  const { role } = useContext(AuthContext);

  if (!data || !data.quiz || data.quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 text-center p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
        <IoCalendarClearOutline className="text-6xl text-gray-400 mb-4" />
        <p className="text-lg">
          You don't have any quizzes in the upcoming section...
        </p>
        <Link
          to={`/${role}/quizzes/createQuiz`}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300">
          Create New Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-2 rounded-md shadow-sm md:p-4 p-3 container">
      <DashBoardHeadings
        heading="Draft Quizzes(Not Ready)"
        path="Show All"
        link={`${role}/quizzes`}
        hideText={hideText}
      />
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {data.quiz.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/${role}/quizzes/${quiz.id}`}
            className="block p-2 bg-white hover:bg-blue-50 shadow-lg rounded-lg transition-all duration-200 ease-in-out min-w-[270px]">
            <div className="flex items-center">
              <img
                src="https://dummyimage.com/50x50.png/09f/fff"
                alt="Quiz image"
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <div className="ml-2">
                <h3 className="md:text-lg text-md font-bold text-gray-700">
                  {quiz.name}
                </h3>
                <p className="text-gray-500 mt-1 text-sm">
                  Topic: {quiz.topics.join(", ")}
                </p>
                {quiz.createdBy.name && (
                  <p className="text-xs text-gray-600 mb-2">
                    Created by: {quiz.createdBy.name}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
