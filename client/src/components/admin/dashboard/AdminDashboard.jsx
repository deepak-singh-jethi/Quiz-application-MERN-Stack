import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

import { QuizzesList } from "../../ui/dashBoard/QuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { StudentList } from "./AdminStudentsList";
import { TeachersList } from "./AdminTeachersList";
import { GroupsList } from "../../ui/dashBoard/GroupsList";

const AdminDashboard = () => {
  const { role } = useContext(AuthContext);
  return (
    <main className="container mx-auto">
      <div className="w-full my-4">
        <AdminNewQuizzesList />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-full">
        <AdminUpcomingQuizzes />
        <AdminGroupsList />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-full">
        {role === "admin" && <AdminStudentsList />}
        {role === "admin" && <AdminTeachersList />}
      </div>
    </main>
  );
};

const AdminTeachersList = withDataFetching(TeachersList, {
  queryKey: ["teachers"],
  URL: "http://localhost:3000/api/v1/users?role=instructor&limit=4",
});

const AdminNewQuizzesList = withDataFetching(QuizzesList, {
  queryKey: ["6-live-quizzes"],
  URL: "http://localhost:3000/api/v1/quiz/admin/free?limit=4",
});

const AdminUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/admin/upcoming?limit=4",
  queryKey: ["5-upcoming-quizzes"],
});

const AdminStudentsList = withDataFetching(StudentList, {
  URL: "http://localhost:3000/api/v1/users?role=user&limit=4",
  queryKey: ["5-students_list"],
});
const AdminGroupsList = withDataFetching(GroupsList, {
  URL: "http://localhost:3000/api/v1/group?limit=2",
  queryKey: ["5-groups_list"],
});

export default AdminDashboard;
