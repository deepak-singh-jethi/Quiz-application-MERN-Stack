import React, { memo } from "react";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";
import DashBoardHeadings from "../../ui/dashBoard/DashBoardHeading.jsx";

const URL = "http://localhost:3000/api/v1/users?role=user&limit=6";

export const StudentList = memo(({ data }) => {
  return (
    <div className="p-6 bg-gray-800 border border-gray-200 rounded-lg shadow-sm w-full mt-6 h-full">
      {/* card heading */}
      <DashBoardHeadings
        heading="New Users"
        path="Show All"
        link="/admin/students"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {data.users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-2 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className=" text-gray-500 text-xs">{user.email}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});
