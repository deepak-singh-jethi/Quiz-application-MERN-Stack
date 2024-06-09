import React, { memo, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { NewQuizzesList } from "../../ui/dashBoard/NewQuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  // const { role, name } = useContext(AuthContext);
  return (
    <main className="flex flex-col">
      {/* create new with button */}
      <div className="w-full my-4 rounded flex flex-wrap md:flex-nowrap">
        <div className="md:basis-2/3">
          <InstructorUpcomingQuizzes />
        </div>
        <div className="flex justify-center items-center md:basis-1/3 w-full bg-red-500">
          <h1 className="text-white font-bold">Latest 2 Results of a quiz</h1>
        </div>
        {/* TODO  add results area here */}
      </div>
      <div className="w-full my-4 rounded">
        <InstructorNewQuizzes />
      </div>
    </main>
  );
};

const InstructorNewQuizzes = withDataFetching(NewQuizzesList, {
  queryKey: ["new_5_quiz"],
  URL: "http://localhost:3000/api/v1/quiz/instructor/published?limit=4",
});

const InstructorUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/unpublished?limit=4",
  queryKey: ["5-upcoming-quizzes"],
});

export default memo(InstructorDashboard);
