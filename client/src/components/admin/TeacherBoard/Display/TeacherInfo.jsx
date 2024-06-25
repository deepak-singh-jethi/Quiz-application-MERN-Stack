import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Loading from "../../../ui/Loading";
import ErrorBlock from "../../../ui/ErrorBlock";
import { authorizedFetcher } from "../../../../utils/http";

const TeacherInfo = () => {
  const { id } = useParams();
  const URL = `http://localhost:3000/api/v1/users/instructor/${id}`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => authorizedFetcher({ URL }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBlock message={error.message} />;

  const { instructor, groups, quizzes } = data;

  return (
    <div className="mt-6 mx-auto max-w-xl space-y-4">
      <div className="flex justify-center items-center gap-3 md:gap-6 lg:gap-10">
        <h1 className="text-center font-bold text-lg sm:text-xl md:text-2xl text-gray-700">
          Teacher Info
        </h1>
        <Link to="/admin/teachers" className="text-blue-500 underline">
          Back
        </Link>
      </div>

      {/* instructor name, email ,role, isActive */}

      <div className="border-2 bg-gray-600 text-gray-200 p-2 md:p-4 xl:p-6 space-y-2 rounded-lg">
        <p>Id : {instructor.id}</p>
        <p>Name: {instructor.name}</p>
        <p>Email: {instructor.email}</p>
        <p>Is Active: {instructor.isActive ? "Yes" : "No"}</p>
      </div>
      {/* groups */}

      <div className="border-2 bg-gray-600 text-gray-200 p-2 rounded-lg">
        <h2 className="text-lg sm:text-lg md:text-xl text-center my-2">
          Groups ({groups.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 ">
          {groups.map((group, index) => (
            <Link
              to={`/admin/groups/${group.id}`}
              key={group.id}
              className=" p-2 bg-gray-700 rounded-lg my-1 md:my-3 hover:bg-gray-800 transition-all ease-in text-sm md:text-md">
              {index + 1}. {group.name}
            </Link>
          ))}
        </div>
      </div>
      {/* quizzes */}
      <div className="border-2 bg-gray-600 text-gray-200 p-2 rounded-lg">
        <h2 className="text-lg sm:text-lg md:text-xl text-center my-2">
          Quizzes ({quizzes.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          {quizzes.map((quiz, index) => (
            <Link
              to={`/admin/quizzes/${quiz.id}`}
              key={quiz.id}
              className=" p-2 bg-gray-700 rounded-lg my-1 md:my-3 hover:bg-gray-800 transition-all ease-in text-sm md:text-md">
              {index + 1}. {quiz.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherInfo;
