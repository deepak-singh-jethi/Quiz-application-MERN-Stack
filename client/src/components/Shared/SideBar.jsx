import React from "react";
import {
  FiHelpCircle,
  FiHome,
  FiLayers,
  FiUsers,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";
import { FaWindowClose } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const liStyle =
  "flex justify-center items-center gap-5 bg-gray-700 hover:bg-gray-600 rounded w-full px-5 py-3";

const SideBarSpan = ({ title }) => {
  return <span className="text-xl mr-4">{title}</span>;
};

const SideBar = ({ isOpen, toggleSidebar }) => {
  const { logout, role } = useContext(AuthContext);
  console.log(role);

  // handling logout
  const handleLogout = () => {
    logout();
  };
  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "w-[250px] " : " md:w-[100px] w-[0px]"
      } transition-transform duration-300 ease-in-out bg-gray-800 text-white flex flex-col justify-between overflow-x-hidden`}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}>
      <div className="p-4 flex justify-end">
        <button
          className="focus:outline-none md:hidden "
          aria-label="Close Menu"
          onClick={() => toggleSidebar(false)}>
          <FaWindowClose className="text-2xl  hover:text-red-500 text-red-700" />
        </button>
      </div>
      <nav className="p-4 mt-4 sm:mt-8 md:mt-14">
        <ul className="space-y-10 md:space-y-16 flex flex-col justify-center items-center ">
          <Link to="/" className={liStyle}>
            <FiHome className="text-2xl" />
            {isOpen && <SideBarSpan title={"Dashboard"} />}
          </Link>
          <Link to={`${role}/quizzes`} className={liStyle}>
            <FiLayers className="text-2xl" />
            {isOpen && <SideBarSpan title={"Quizzes"} />}
          </Link>
          {role === "admin" && (
            <Link to={`${role}/students`} className={liStyle}>
              <FiUsers className="text-2xl" />
              {isOpen && <SideBarSpan title={"Students"} />}
            </Link>
          )}
          <Link to={`${role}/results`} className={liStyle}>
            <FiBarChart2 className="text-2xl" />
            {isOpen && <SideBarSpan title={"Results"} />}
          </Link>
        </ul>
      </nav>
      <div className="p-4 w-full mb-10 flex flex-col space-y-10">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none flex items-center mx-auto min-w-16">
          <FiHelpCircle className="mr-2" />
          {isOpen && <span>Help?</span>}
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none flex items-center mx-auto min-w-16"
          onClick={handleLogout}>
          <FiLogOut className="mr-2" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
