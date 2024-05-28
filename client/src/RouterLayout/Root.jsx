import React from "react";
import { Outlet } from "react-router";

const Root = () => {
  return (
    <div className="md:px-4 py-2">
      <Outlet />
    </div>
  );
};

export default Root;
