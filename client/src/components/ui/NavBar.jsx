import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaBuildingUser } from "react-icons/fa6";
import { AuthContext } from "../../context/AuthContext";

const navBtnClass =
  "flex h-fit justify-center items-center gap-2 border-2 hover:bg-gray-600 hover:text-white rounded-full md:p-2 p-1  transition-colors duration-300";

const NavBar = memo(() => {
  const { role, name } = useContext(AuthContext);
  return (
    <>
      <div className="flex justify-evenly md:justify-between items-center mx-2 sm:mx-4 gap-1 sm:gap-4 basis-3/4">
        <h1 className="text-lg sm:text-xl  font-bold text-gray-800 hidden md:block ">
          {name.toUpperCase()}
        </h1>
        <Link className={navBtnClass} to={`/${role}/quizzes/createQuiz`}>
          <IoAddCircleSharp className="text-lg sm:text-2xl md:text-3xl" />
          Quiz
        </Link>
        {role === "admin" && (
          <Link className={navBtnClass}>
            <IoAddCircleSharp className="text-lg sm:text-2xl md:text-3xl" />
            Teacher
          </Link>
        )}
      </div>
      <button className="border-2 rounded-full p-2 transition-colors duration-300 hover:bg-gray-600 hover:text-white">
        <FaBuildingUser className="text-lg sm:text-2xl md:text-3xl  " />
      </button>
    </>
  );
});

export default NavBar;
