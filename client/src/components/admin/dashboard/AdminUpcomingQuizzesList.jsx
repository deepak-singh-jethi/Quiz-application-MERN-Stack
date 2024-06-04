import React, { memo } from "react";
import { Link } from "react-router-dom";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import DashBoardHeadings from "../../Shared/DashBoardHeading";

const URL = "http://localhost:3000/api/v1/quiz/admin/upcoming?limit=4";

const UpcomingQuizzes = memo(({ data }) => {
  if (data.quiz.length === 0) return <div>No Upcoming Quizzes</div>;

  return (
    <div className="p-6 bg-gray-800 border-2 rounded-md shadow-sm xl:w-fit w-full">
      <DashBoardHeadings heading="Upcoming Quizzes" path="Show All" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.quiz.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quiz/${quiz.id}`}
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

const AdminUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL,
  queryKey: ["upcoming", "quizzes"],
});
export default AdminUpcomingQuizzes;
