import React, { memo, useState } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";

import { QuizzesList } from "../../ui/dashBoard/QuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { Link } from "react-router-dom";
import QuizAreaButtons from "../../ui/QuizAreaButtons";

const AdminAllQuizzesArea = () => {
  const [selectedQuizArea, setSelectedQuizArea] = useState("freeQuizzes");
  return (
    <div>
      <div className="flex w-full flex-col justify-center items-center gap-4 space-y-4 md:space-y-6 my-3 md:my-5">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-2 ">
          <QuizAreaButtons
            key="freeQuiz"
            title="Free Quizzes"
            handleState={() => setSelectedQuizArea("freeQuizzes")}
            selectedQuizArea={selectedQuizArea}
            stateValue="freeQuizzes"
          />
          <QuizAreaButtons
            key="readyToUseQuiz"
            title="Ready Quizzes"
            handleState={() => setSelectedQuizArea("readyToUseQuizzes")}
            selectedQuizArea={selectedQuizArea}
            stateValue="readyToUseQuizzes"
          />
          <QuizAreaButtons
            key="incompleteQuiz"
            title="Incomplete"
            handleState={() => setSelectedQuizArea("upcomingQuizzes")}
            selectedQuizArea={selectedQuizArea}
            stateValue="upcomingQuizzes"
          />
          <Link
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs min-h-6 sm:text-sm md:text-md  font-bold py-1 px-2 sm:py-2 sm:px-3 rounded transition-all duration-300"
            to="/admin/quizzes/createQuiz">
            Create New +
          </Link>
        </div>
      </div>

      {selectedQuizArea === "freeQuizzes" && <AdminAllFreeQuizzes />}
      {selectedQuizArea === "upcomingQuizzes" && <AdminAllUpcomingQuizzes />}
      {selectedQuizArea === "readyToUseQuizzes" && (
        <AdminAllReadyToUseQuizzes />
      )}
    </div>
  );
};
const AdminAllUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/admin/upcoming",
  queryKey: ["AllUpcomingQuizzes"],
  additionalProps: { hideText: true },
});

const AdminAllFreeQuizzes = withDataFetching(QuizzesList, {
  URL: "http://localhost:3000/api/v1/quiz/admin/free",
  queryKey: ["AllLiveQuizzes"],
  additionalProps: { hideText: true },
});
export const AdminAllReadyToUseQuizzes = withDataFetching(QuizzesList, {
  URL: "http://localhost:3000/api/v1/quiz/admin/published?isPublished=true",
  queryKey: ["AllReadyToUseQuizzes"],
  additionalProps: { hideText: true },
});

export default memo(AdminAllQuizzesArea);
