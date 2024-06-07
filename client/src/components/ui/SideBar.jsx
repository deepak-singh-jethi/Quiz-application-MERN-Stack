import React, { memo, useCallback, useContext } from "react";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FaWindowClose } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import AdminSideList from "../admin/Nav/SideList";
import UserSideList from "../users/nav/UserSideList";
import InstructorSideList from "../Instructor/Nav/SideList";
import { useNavigate } from "react-router";

const SideBar = memo(({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, role } = useContext(AuthContext);

  // handling logout
  const handleLogout = useCallback(() => {
    console.log("log out");
    logout();
    return navigate("/auth");
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "w-[250px] " : " md:w-[100px] w-[0px]"
      } transition-transform duration-300 ease-in-out bg-gray-800 text-white flex flex-col justify-between overflow-x-hidden z-50`}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}>
      {/* Close side bar button for mobile */}
      <div className="p-4 flex justify-end md:hidden">
        <button
          className="focus:outline-none  "
          aria-label="Close Menu"
          onClick={() => toggleSidebar(false)}>
          <FaWindowClose className="text-2xl  hover:text-red-500 text-red-700" />
        </button>
      </div>

      {/* Sidebar content */}
      <nav className="p-4 mt-4 sm:mt-6 md:mt-24">
        {/* for admin */}
        {role === "admin" && (
          <AdminSideList
            isOpen={isOpen}
            role={role}
            toggleSidebar={toggleSidebar}
          />
        )}

        {/* for users */}
        {role === "user" && (
          <UserSideList
            isOpen={isOpen}
            role={role}
            toggleSidebar={toggleSidebar}
          />
        )}

        {/* for instructor */}
        {role === "instructor" && (
          <InstructorSideList
            isOpen={isOpen}
            role={role}
            toggleSidebar={toggleSidebar}
          />
        )}
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
});

export default SideBar;
