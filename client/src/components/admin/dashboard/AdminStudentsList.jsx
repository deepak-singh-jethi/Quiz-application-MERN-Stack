import React, { memo } from "react";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";
import DashBoardHeadings from "../../ui/dashBoard/DashBoardHeading.jsx";

const URL = "http://localhost:3000/api/v1/users?role=user&limit=6";

export const StudentList = memo(({ data }) => {
  return (
    <div className="md:p-4 p-2 bg-gray-800 border border-gray-200 rounded-lg shadow-sm w-full  h-full">
      {/* card heading */}
      <DashBoardHeadings
        heading="New Users"
        path="Show All"
        link="/admin/students"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {data.users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-2 ">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-800">{user.name}</h2>
              <p className=" text-gray-500 text-xs">{user.email}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Joined:
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
