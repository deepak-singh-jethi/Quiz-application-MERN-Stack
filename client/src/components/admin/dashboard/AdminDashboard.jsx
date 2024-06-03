import React, { useState } from "react";

import MainLayout from "../../Shared/MainLayout";
import AdminStudentsList from "./AdminStudentsList";
import AdminUpcomingQuizzes from "./AdminUpcomingQuizzesList";
import AdminNewQuizzesList from "./AdminNewQuizzesList";
// import AdminTeachersList from "./AdminTeachersList";
import AdminTeachersList from "./AdminTeachersList";

const AdminDashboard = () => {
  return (
    <MainLayout>
      <main className="flex flex-col gap-4 my-4">
        <div className="flex flex-wrap justify-center   gap-3  mx-auto mt-5">
          <AdminUpcomingQuizzes />
          <AdminStudentsList />
        </div>
        <div className="flex gap-3 min-[850px]:flex-nowrap flex-wrap mt-5 justify-center mx-4">
          <AdminNewQuizzesList />
          <AdminTeachersList />
        </div>
      </main>
    </MainLayout>
  );
};

export default AdminDashboard;
