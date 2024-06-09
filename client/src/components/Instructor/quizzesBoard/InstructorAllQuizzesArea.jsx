import React, { memo } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { NewQuizzesList } from "../../ui/dashBoard/NewQuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { Link } from "react-router-dom";

const InstructorAllQuizzesArea = () => {
  return (
    <div>
      <div className="flex w-full flex-col justify-center items-center gap-4 space-y-2 my-5">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="/instructor/quizzes/createQuiz">
          Create New Quiz
        </Link>
      </div>
      <InstructorAllUpcomingQuizzes />
      <InstructorAllNewQuizzes />
    </div>
  );
};

const InstructorAllNewQuizzes = withDataFetching(NewQuizzesList, {
  queryKey: ["AllLiveQuizzes"],
  URL: "http://localhost:3000/api/v1/quiz/instructor/published",
  additionalProps: { hideText: true },
});

const InstructorAllUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/unpublished",
  queryKey: ["AllUpcomingQuizzes"],
  additionalProps: { hideText: true },
});

export default memo(InstructorAllQuizzesArea);
