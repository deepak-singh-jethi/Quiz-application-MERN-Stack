import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { NewQuizzesList } from "../../ui/dashBoard/NewQuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

import MainLayout from "../../ui/MainLayout";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const { role, name, email, id, token } = useContext(AuthContext);
  return (
    <MainLayout>
      <main className="flex flex-col gap-4 my-4">
        <h1 className="text-2xl font-bold mx-4">
          Welcome, {role} {name}
        </h1>
        {/* create new with button */}
        <div className="flex gap-4 mx-4">
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to="instructor/quizzes/createQuiz">
            Create New Quiz
          </Link>
        </div>
        <div className="w-full my-4 rounded">
          <InstructorUpcomingQuizzes />
        </div>
        <div className="w-full my-4 rounded">
          <InstructorNewQuizzes />
        </div>
      </main>
    </MainLayout>
  );
};

const InstructorNewQuizzes = withDataFetching(NewQuizzesList, {
  queryKey: ["new_5_quiz"],
  URL: "http://localhost:3000/api/v1/quiz/instructor/published",
});

const InstructorUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/unpublished",
  queryKey: ["upcoming", "quizzes"],
});

export default InstructorDashboard;
