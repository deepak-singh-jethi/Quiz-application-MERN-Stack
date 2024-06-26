import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const AddTeacher = lazy(() => import("../Features/AddTeacher"));
const DisplayTeachers = lazy(() => import("./DisplayTeachers"));

const TeachersArea = () => {
  const [pageState, setPageState] = useState("display");
  const content = () => {
    switch (pageState) {
      case "display":
        return <DisplayTeachers />;
      case "add":
        return <AddTeacher />;
      default:
        return <DisplayTeachers />;
    }
  };
  return (
    <>
      {/* buttons to change state of the page */}
      <div
        className="
        flex flex-row justify-center items-center gap-2 my-4
      ">
        <button
          onClick={() => setPageState("display")}
          className="
        bg-gray-600 hover:bg-gray-700 text-white font-bold md:py-2 py-1 md:px-4 px-2 rounded focus:outline-none focus:ring focus:ring-gray-500
        ">
          Display
        </button>
        <Link
          to="new"
          className="
        bg-gray-600 hover:bg-gray-700 text-white font-bold md:py-2 py-1 md:px-4 px-2 rounded
        focus:outline-none focus:ring focus:ring-gray-500">
          Add
        </Link>
      </div>
      {/* content */}
      <div
        className="
      flex flex-col justify-center items-center
      ">
        {content()}
      </div>
    </>
  );
};

export default TeachersArea;
