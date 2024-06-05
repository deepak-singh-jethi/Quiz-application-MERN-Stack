import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "../components/ui/MainLayout";

const AdminLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AdminLayout;
