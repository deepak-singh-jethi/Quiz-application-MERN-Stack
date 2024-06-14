import React, { memo, useState } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { QuizzesList } from "../../ui/dashBoard/QuizzesList";
import { UpcomingQuizzes } from "../../ui/dashBoard/UpcomingQuizzesList";
import { Link } from "react-router-dom";
import QuizAreaButtons from "../../ui/QuizAreaButtons";

const InstructorAllQuizzesArea = () => {
  const [selectedQuizArea, setSelectedQuizArea] = useState("freeQuizzes");

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col items-center gap-4 space-y-2 my-5 w-full">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Manage Quizzes
        </h1>
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

      <div className="w-full">
        {selectedQuizArea === "freeQuizzes" && <InstructorAllFreeQuizzes />}
        {selectedQuizArea === "upcomingQuizzes" && (
          <InstructorAllUpcomingQuizzes />
        )}
        {selectedQuizArea === "readyToUseQuizzes" && (
          <InstructorAllReadyToUseQuizzes />
        )}
      </div>
    </div>
  );
};

const InstructorAllFreeQuizzes = withDataFetching(QuizzesList, {
  queryKey: ["AllLiveQuizzes"],
  URL: "http://localhost:3000/api/v1/quiz/instructor/free",
  additionalProps: { hideText: true },
});

const InstructorAllUpcomingQuizzes = withDataFetching(UpcomingQuizzes, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/upcoming",
  queryKey: ["AllUpcomingQuizzes"],
  additionalProps: { hideText: true },
});

export const InstructorAllReadyToUseQuizzes = withDataFetching(QuizzesList, {
  URL: "http://localhost:3000/api/v1/quiz/instructor/published",
  queryKey: ["AllReadyToUseQuizzes"],
  additionalProps: { hideText: true },
});

export default memo(InstructorAllQuizzesArea);
