import React, { memo } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";
import DashBoardHeadings from "../../ui/dashBoard/DashBoardHeading.jsx";

export const TeachersList = memo(({ data }) => {
  if (!data || !data.users || data.users.length === 0) {
    return (
      <div className="text-gray-600 text-center p-6">
        No Teacher is Available..
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border border-gray-200 rounded-lg shadow-sm  w-full  mt-6 h-full">
      {/* card heading */}
      <DashBoardHeadings
        heading="Teachers"
        path="Manage.."
        link="/admin/teachers"
      />
      {/* card body and teachers card */}
      <div className="grid grid-cols-1 gap-6">
        {data.users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg px-4 py-1 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="mx-2 space-y-2 py-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
