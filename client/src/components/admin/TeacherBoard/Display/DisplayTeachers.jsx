import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../ui/Loading.jsx";
import ErrorBlock from "../../../ui/ErrorBlock.jsx";
import { queryClient, authorizedFetcher } from "../../../../utils/http.js";
import { Link } from "react-router-dom";

const URL = "http://localhost:3000/api/v1/users?role=instructor";
const thStyle =
  "text-left py-3 px-4 bg-gray-200 text-gray-600 font-bold uppercase text-sm border-b border-gray-300";
const tdStyle = "py-3 px-4 border-b  border-gray-300";

const DisplayTeachers = () => {
  const [paginationData, setPaginationData] = useState({
    startIndex: 0,
    maxItemNumber: 15,
    currentPage: 1,
  });

  // mn=2  cp=1 , si=0,
  // next => si=si+mn=2 cp = cp+1 = 2
  // prev => si =si-mn =0 cp = cp-1 = 1

  // prev not when cp = 1
  // next not when cp*mn < total items

  const { maxItemNumber, startIndex, currentPage } = paginationData;

  const {
    data: teachers,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: ({ signal }) => authorizedFetcher({ signal, URL }),
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorBlock message={error.message} />;

  if (teachers && teachers.users.length === 0) {
    return <p className="text-gray-600 text-center">No teachers found</p>;
  }
  const items = teachers.users.slice(startIndex, startIndex + maxItemNumber);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-gray-700 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold border-b pb-2 md:mt-4 mb-4 text-center">
        All Teachers
      </h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className={thStyle}>No.</th>
            <th className={thStyle}>Name</th>
            <th className={thStyle + " text-center"}>Email</th>
            <th className={thStyle + " text-center"}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((teacher, index) => (
            <tr
              key={teacher._id}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition-colors duration-200`}>
              <td className={tdStyle + " text-center"}>
                {index + currentPage}
              </td>
              <td className={tdStyle}>{teacher.name}</td>
              <td className={tdStyle + " text-center"}>{teacher.email}</td>
              <td className={tdStyle + " text-center"}>
                <Link
                  to={`${teacher._id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <div className="flex justify-center mt-4 space-x-3">
        {currentPage > 1 && (
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
            onClick={() =>
              setPaginationData((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
                startIndex: prev.startIndex - prev.maxItemNumber,
              }))
            }>
            Prev
          </button>
        )}

        {currentPage * maxItemNumber < teachers.users.length && (
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
            onClick={() =>
              setPaginationData((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                startIndex: prev.startIndex + prev.maxItemNumber,
              }))
            }>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default DisplayTeachers;
