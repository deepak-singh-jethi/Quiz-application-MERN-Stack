import React, { useState } from "react";
import { FaBurger } from "react-icons/fa6";
import SideBar from "./SideBar";
import logo from "../../../public/logo.png";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (open) => {
    setSidebarOpen(open);
  };

  return (
    <div className="">
      <div>
        {!isSidebarOpen && (
          <div className="flex justify-between px-6 md:hidden">
            <button
              className="p-1 md:p-4 md:hidden"
              onClick={() => toggleSidebar(true)}
              aria-label="Open Menu">
              <FaBurger className="text-2xl text-gray-700" />
            </button>
            <div className="inline ">
              <img src={logo} alt="" className="w-6" />
            </div>
          </div>
        )}
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <main className="flex-1 border-2 p-2 sm:p-4 md:p-6  sm:ml-14  md:ml-24">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
