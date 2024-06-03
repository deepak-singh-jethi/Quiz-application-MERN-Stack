import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "../components/Shared/MainLayout";

const UserLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default UserLayout;
