import React, { memo } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

import { NewQuizzesList } from "../../ui/dashBoard/NewQuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { Link } from "react-router-dom";

const AdminAllQuizzesArea = ({ isTrue = false }) => {
  return (
    <div>
      <div className="flex w-full flex-col justify-center items-center gap-4 space-y-6 my-5">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>

        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="/admin/quizzes/createQuiz">
          Create New Quiz
        </Link>
      </div>
      <AdminAllUpcomingQuizzes />
      <AdminAllLiveQuizzes />
    </div>
  );
};
const AdminAllUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/admin/upcoming",
  queryKey: ["AllUpcomingQuizzes"],
  additionalProps: { hideText: true },
});

const AdminAllLiveQuizzes = withDataFetching(NewQuizzesList, {
  URL: "http://localhost:3000/api/v1/quiz//admin/myPublished",
  queryKey: ["AllLiveQuizzes"],
  additionalProps: { hideText: true },
});

export default memo(AdminAllQuizzesArea);
