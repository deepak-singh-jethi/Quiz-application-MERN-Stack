import React, { useContext } from "react";
import DashBoardHeadings from "./DashBoardHeading";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { RiEmotionUnhappyLine } from "react-icons/ri";

export const GroupsList = ({ data, hideText }) => {
  const { role } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-6 py-4 bg-gray-800 rounded-md text-center">
      <DashBoardHeadings
        heading="Groups"
        path="Show All"
        link={`${role}/groups`}
        hideText={hideText}
      />
      {data.groups.length === 0 ? (
        <div className="flex flex-col items-center justify-start h-full p-6">
          <p className="text-gray-300 text-xl mb-4">No groups found</p>
          <RiEmotionUnhappyLine className="text-gray-300 text-6xl" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          {data.groups.map((group) => (
            <div
              key={group._id}
              className="flex flex-col justify-between bg-white rounded-lg p-4 w-[280px] mb-6">
              <div className="flex justify-center items-center text-gray-600 md:text-xl text-lg font-bold mb-4">
                {group.name}
              </div>
              <div className="flex justify-between text-gray-600">
                <div className="flex flex-col items-center">
                  <p className="text-md font-semibold">Quizzes</p>
                  <p className="md:text-md text-sm font-bold">
                    {group.quizzes.length}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-md font-semibold">Students</p>
                  <p className="md:text-md text-sm font-bold">
                    {group.members.length}
                  </p>
                </div>
              </div>
              {role === "admin" && (
                <div className="text-gray-500 text-sm mt-2">
                  Created by:{" "}
                  <span className="text-gray-500 font-medium">
                    {group.createdBy.name}
                  </span>{" "}
                  on {new Date(group.createdAt).toLocaleString()}
                </div>
              )}
              <Link
                to={`/${role}/groups/${group._id}`}
                className="text-gray-600 md:text-md text-sm  mt-4  underline hover:text-gray-400 text-center">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsList;
