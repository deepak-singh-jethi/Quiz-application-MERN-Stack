import React from "react";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";

const URL = "http://localhost:3000/api/v1/users?role=user&limit=6";

const studentList = ({ data }) => {
  return (
    <div className="p-6 bg-gray-800 border border-gray-200 rounded-lg shadow-sm xl:w-fit w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Newly Joined Users
        </h1>
        <span className="text-blue-600 font-bold underline">Show All</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {/* <p className="text-sm text-gray-600">
              <span className="font-semibold">Interests:</span>{" "}
              {user.interestedIn.join(", ")}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminStudentsList = withDataFetching(studentList, {
  URL,
  queryKey: ["students_list"],
});

export default AdminStudentsList;
