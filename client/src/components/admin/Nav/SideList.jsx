import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiHome, FiLayers, FiBarChart2 } from "react-icons/fi";
import { MdGroups } from "react-icons/md";
import { PiStudent } from "react-icons/pi";

const liStyle =
  "flex justify-center items-center gap-5 bg-gray-700 hover:bg-gray-600 rounded w-full px-5 py-3";

const SideBarSpan = ({ title }) => {
  return <span className="text-xl mr-4">{title}</span>;
};

const AdminSideList = ({ isOpen, role, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    toggleSidebar(false);
    navigate(link);
  };

  return (
    <ul className="space-y-8 md:space-y-12 flex flex-col justify-center items-center ">
      {/* Dashboard */}
      <li onClick={() => handleNavigate("/")} className={liStyle}>
        <FiHome className="text-2xl" />
        {isOpen && <SideBarSpan title={"Dashboard"} />}
      </li>

      {/* Groups */}
      <li onClick={() => handleNavigate(`/${role}/groups`)} className={liStyle}>
        <MdGroups className="text-2xl" />
        {isOpen && <SideBarSpan title={"Groups"} />}
      </li>

      {/* Quizzes */}
      <li
        onClick={() => handleNavigate(`/${role}/quizzes`)}
        className={liStyle}>
        <FiLayers className="text-2xl" />
        {isOpen && <SideBarSpan title={"Quizzes"} />}
      </li>

      {/* Students */}
      <li
        onClick={() => handleNavigate(`/${role}/students`)}
        className={liStyle}>
        <PiStudent className="text-2xl" />
        {isOpen && <SideBarSpan title={"Students"} />}
      </li>
      {/* Results */}
      <li
        onClick={() => handleNavigate(`/${role}/results`)}
        className={liStyle}>
        <FiBarChart2 className="text-2xl" />
        {isOpen && <SideBarSpan title={"Results"} />}
      </li>
    </ul>
  );
};

export default memo(AdminSideList);
