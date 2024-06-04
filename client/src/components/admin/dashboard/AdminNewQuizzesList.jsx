import React from "react";
import { Link } from "react-router-dom";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";
import DashBoardHeadings from "../../Shared/DashBoardHeading.jsx";

const URL = "http://localhost:3000/api/v1/quiz?limit=6";

const NewQuizzesList = ({ data }) => {
  if (!data || !data.quiz || data.quiz.length === 0)
    return (
      <div className="text-gray-600 text-center p-6">No Upcoming Quizzes</div>
    );

  return (
    <div className="md:p-6 p-3 bg-gray-800 border border-gray-200 rounded-lg shadow-sm mt-6 xl:w-fit w-full md:basis-3/4">
      {/* heading area */}
      <DashBoardHeadings heading="Ongoing Quizzes" path="Show more.." />

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
                to={`/quiz/${quiz.id}`}
                className="inline-block bg-[#1F2937] text-white py-1 sm:py-2 sm:px-4 px-2 rounded-lg hover:bg-[#2d3642] transition duration-200">
                Start Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminNewQuizzesList = withDataFetching(NewQuizzesList, {
  queryKey: ["new_5_quiz"],
  URL,
});

export default AdminNewQuizzesList;
