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
      <main className="flex flex-col gap-4 my-4">
        <div className="flex  justify-center gap-3  mx-auto mt-5">
          <AdminUpcomingQuizzes />
          {role === "admin" && <AdminStudentsList />}
        </div>
        <div className="flex gap-3 min-[850px]:flex-nowrap flex-wrap mt-5 justify-center mx-4">
          <AdminNewQuizzesList />
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
  queryKey: ["new_6_quiz"],
  URL: "http://localhost:3000/api/v1/quiz?limit=6",
});

const AdminUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/admin/upcoming?limit=4",
  queryKey: ["upcoming", "quizzes"],
});

const AdminStudentsList = withDataFetching(StudentList, {
  URL: "http://localhost:3000/api/v1/users?role=user&limit=6",
  queryKey: ["students_list"],
});

export default AdminDashboard;
