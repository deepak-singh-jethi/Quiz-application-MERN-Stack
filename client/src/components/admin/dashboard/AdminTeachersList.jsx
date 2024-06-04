import React from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching.jsx";
import DashBoardHeadings from "../../Shared/DashBoardHeading.jsx";

const TeachersList = ({ data }) => {
  if (!data || !data.users || data.users.length === 0) {
    return (
      <div className="text-gray-600 text-center p-6">
        No Teacher is Available..
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border border-gray-200 rounded-lg shadow-sm xl:w-fit w-full md:basis-1/4 mt-6">
      {/* card heading */}
      <DashBoardHeadings heading="Teachers" path="Manage.." />

      {/* card body and teachers card */}
      <div className="grid grid-cols-1 gap-6">
        {data.users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg px-4 py-1 transition duration-300 ease-in-out transform hover:scale-105">
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
          </div>
        ))}
      </div>
    </div>
  );
};

// Wrap TeachersList with withDataFetching HOC
const AdminTeachersList = withDataFetching(TeachersList, {
  queryKey: ["teachers"],
  URL: "http://localhost:3000/api/v1/users?role=instructor&limit=5",
});

export default AdminTeachersList;
