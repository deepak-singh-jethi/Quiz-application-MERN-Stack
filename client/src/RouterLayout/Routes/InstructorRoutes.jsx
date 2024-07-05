import React, { lazy, Suspense } from "react";
import Loading from "../../components/ui/Loading.jsx";
import { Route } from "react-router-dom";

const QuizDetails = lazy(() => import("../../components/quiz/QuizDetails.jsx"));

const NewQuiz = lazy(() => import("../../components/quiz/NewQuiz.jsx"));

const GroupDetails = lazy(() =>
  import("../../components/group/display/GroupDetails.jsx")
);

const InstructorAllQuizzesArea = lazy(() =>
  import(
    "../../components/Instructor/quizzesBoard/InstructorAllQuizzesArea.jsx"
  )
);
const InstructorAllGroupArea = lazy(() =>
  import("../../components/Instructor/groupBoard/InstructorAllGroupArea.jsx")
);

export const instructorRoutes = () => {
  return (
    <>
      <Route
        path="quizzes"
        element={
          <Suspense fallback={<Loading />}>
            <InstructorAllQuizzesArea />
          </Suspense>
        }
      />
      <Route
        path="quizzes/:quizId"
        element={
          <Suspense fallback={<Loading />}>
            <QuizDetails />
          </Suspense>
        }
      />
      <Route
        path="quizzes/createQuiz"
        element={
          <Suspense fallback={<Loading />}>
            <NewQuiz />
          </Suspense>
        }
      />
      <Route
        path="groups"
        element={
          <Suspense fallback={<Loading />}>
            <InstructorAllGroupArea />
          </Suspense>
        }
      />
      <Route
        path="groups/:groupId"
        element={
          <Suspense fallback={<Loading />}>
            <GroupDetails />
          </Suspense>
        }
      />
      <Route path="results" element={<h1>Results</h1>} />
      <Route path="results/:id" element={<h1>1 Result</h1>} />
    </>
  );
};
