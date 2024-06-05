import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";
import UserDashboard from "../components/users/dashboard/UserDashboard";
import InstructorDashboard from "../components/Instructor/dashboard/InstructorDashboard";

const HomeLayout = () => {
  const { role } = useContext(AuthContext);
  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "user" && <UserDashboard />}
      {role === "instructor" && <InstructorDashboard />}
    </>
  );
};

export default HomeLayout;
