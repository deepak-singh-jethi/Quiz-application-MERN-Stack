import React, { useState, memo } from "react";
import { FaBurger } from "react-icons/fa6";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const MainLayout = memo(({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (open) => {
    setSidebarOpen(open);
  };

  return (
    <div className="md:ml-24">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <nav className="flex justify-between items-center px-2 sm:px-10 w-full py-3 border-b-2 ">
        {/* for mobile hamburger button */}
        {!isSidebarOpen && (
          <div className="px-1 sm:px-2 md:px-4 md:hidden inline-block">
            <button
              className="p-1 md:p-4 inline-block md:hidden"
              onClick={() => toggleSidebar(true)}
              aria-label="Open Menu">
              <FaBurger className="text-2xl text-gray-700" />
            </button>
          </div>
        )}
        {/* change it according to user and admin */}
        <NavBar />
      </nav>
      {children}
    </div>
  );
});

export default MainLayout;
