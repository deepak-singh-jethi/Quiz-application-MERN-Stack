import React, { memo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { authorizedFetcher } from "../../../utils/http";
import { Link } from "react-router-dom";
import Loading from "../../Shared/Loading";
import ErrorBlock from "../../Shared/ErrorBlock";
import { AuthContext } from "../../../context/AuthContext";

const URL = "http://localhost:3000/api/v1/quiz/admin/upcoming?limit=4";

const AdminUpcomingQuizzes = memo(() => {
  const { token } = useContext(AuthContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["upcoming", "quizzes"],
    queryFn: ({ signal }) => authorizedFetcher({ signal, URL, token }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBlock message={error.message} />;
  if (data.quiz.length === 0) return <div>No Upcoming Quizzes</div>;

  return (
    <div className="p-6 bg-gray-800 border-2 rounded-md shadow-sm xl:w-fit w-full">
      <div className="flex justify-between items-center mb-6 gap-5">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Upcoming Quizzes
        </h1>
        <Link
          to="/quizzes/upcoming"
          className="text-blue-600 font-semibold underline">
          Show All
        </Link>
      </div>

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
                  <span className="font-bold">Scheduled for:</span>{" "}
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

export default AdminUpcomingQuizzes;
