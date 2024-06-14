import React, { memo, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { QuizzesList } from "../../ui/dashBoard/QuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import GroupsList from "../../ui/dashBoard/GroupsList";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

const InstructorDashboard = () => {
  // const { role, name } = useContext(AuthContext);
  return (
    <main className="container mx-auto mt-6">
      {/* create new with button */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InstructorUpcomingQuizzes />
        <InstructorGroupsList />
      </div>

      <div className="flex justify-center items-center md:basis-1/3 w-full bg-red-500">
        <h1 className="text-white font-bold">Latest 2 Results of a quiz</h1>
      </div>
      {/* TODO  add results area here */}

      <div className="w-full my-4 rounded">
        <InstructorFreeQuizzes />
      </div>
    </main>
  );
};

const InstructorFreeQuizzes = withDataFetching(QuizzesList, {
  queryKey: ["new_5_quiz"],
  URL: "http://localhost:3000/api/v1/quiz/instructor/free?limit=4",
});

const InstructorUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/upcoming?limit=4",
  queryKey: ["5-upcoming-quizzes"],
});
const InstructorGroupsList = withDataFetching(GroupsList, {
  URL: "http://localhost:3000/api/v1/group/instructor/all?limit=2",
  queryKey: ["5-groups_list"],
});

export default memo(InstructorDashboard);
