import React from "react";
import { Link } from "react-router-dom";

import { FiHome, FiLayers, FiUsers, FiBarChart2 } from "react-icons/fi";

const liStyle =
  "flex justify-center items-center gap-5 bg-gray-700 hover:bg-gray-600 rounded w-full px-5 py-3";

const SideBarSpan = ({ title }) => {
  return <span className="text-xl mr-4">{title}</span>;
};

const AdminSideList = ({ isOpen, role }) => {
  return (
    <ul className="space-y-8 md:space-y-12 flex flex-col justify-center items-center ">
      {/* Links */}
      {/* Dashboard */}
      <Link to="/" className={liStyle}>
        <FiHome className="text-2xl" />
        {isOpen && <SideBarSpan title={"Dashboard"} />}
      </Link>
      {/* Quizzes */}
      <Link to={`/${role}/quizzes`} className={liStyle}>
        <FiLayers className="text-2xl" />
        {isOpen && <SideBarSpan title={"Quizzes"} />}
      </Link>
      {/* Students */}
      {role === "admin" && (
        <Link to={`/${role}/students`} className={liStyle}>
          <FiUsers className="text-2xl" />
          {isOpen && <SideBarSpan title={"Students"} />}
        </Link>
      )}
      {/* Results */}
      <Link to={`/${role}/results`} className={liStyle}>
        <FiBarChart2 className="text-2xl" />
        {isOpen && <SideBarSpan title={"Results"} />}
      </Link>
    </ul>
  );
};

export default AdminSideList;
