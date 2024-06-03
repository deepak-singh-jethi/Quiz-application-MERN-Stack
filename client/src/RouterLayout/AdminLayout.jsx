import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "../components/Shared/MainLayout";

const AdminLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AdminLayout;
