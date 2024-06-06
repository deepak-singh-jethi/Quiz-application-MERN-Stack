import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { IoCalendarClearOutline } from "react-icons/io5";

import DashBoardHeadings from "./DashBoardHeading";
import { AuthContext } from "../../../context/AuthContext";

export const UpcomingQuizzes = memo(({ data }) => {
  const { role } = useContext(AuthContext);
  if (data.quiz.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 text-center p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md w-1/3">
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

  return (
    <div className="p-6 bg-gray-800 border-2 rounded-md shadow-sm xl:w-fit w-full">
      <DashBoardHeadings
        heading="Upcoming Quizzes"
        path="Show All"
        link="/admin/quizzes"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.quiz.map((quiz) => (
          <Link
            key={quiz.id}
            to={`${role}/quizzes/${quiz.id}`}
            className="block p-4 bg-white hover:bg-blue-50 shadow-lg rounded-lg transition-all duration-200 ease-in-out">
            <div className="flex items-center">
              <img
                src="https://dummyimage.com/50.png/09f/fff"
                alt="Quiz image"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {quiz.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Topic: {quiz.topics.join(", ")}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-bold">Scheduled:</span>{" "}
                  {new Date(quiz.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
