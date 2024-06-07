import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import MainLayout from "../../ui/MainLayout";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

import { NewQuizzesList } from "../../ui/dashBoard/NewQuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { StudentList } from "./AdminStudentsList";
import { TeachersList } from "./AdminTeachersList";

const AdminDashboard = () => {
  const { role } = useContext(AuthContext);
  return (
    <MainLayout>
      <main className="container mx-auto">
        <div className="w-full my-4">
          <AdminNewQuizzesList />
        </div>
        <div className="w-full my-4">
          <AdminUpcomingQuizzes />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-full">
          {role === "admin" && <AdminStudentsList />}
          {role === "admin" && <AdminTeachersList />}
        </div>
      </main>
    </MainLayout>
  );
};

const AdminTeachersList = withDataFetching(TeachersList, {
  queryKey: ["teachers"],
  URL: "http://localhost:3000/api/v1/users?role=instructor&limit=5",
});

const AdminNewQuizzesList = withDataFetching(NewQuizzesList, {
  queryKey: ["live", "quizzes"],
  URL: "http://localhost:3000/api/v1/quiz?limit=8",
});

const AdminUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/admin/upcoming?limit=5",
  queryKey: ["upcoming", "quizzes"],
});

const AdminStudentsList = withDataFetching(StudentList, {
  URL: "http://localhost:3000/api/v1/users?role=user&limit=6",
  queryKey: ["students_list"],
});

export default AdminDashboard;
