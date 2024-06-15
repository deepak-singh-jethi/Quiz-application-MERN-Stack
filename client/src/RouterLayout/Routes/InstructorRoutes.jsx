import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "../../utils/HigerOrderComponent/ProtectedRoute";
import Loading from "../../components/ui/Loading";

const InstructorLayout = lazy(() => import("../InstructorLayout"));

const InstructorAllQuizzesArea = lazy(() =>
  import("../../components/Instructor/quizzesBoard/InstructorAllQuizzesArea")
);
const InstructorAllGroupArea = () =>
  import("../../components/Instructor/groupBoard/InstructorAllGroupArea");
const GroupDetails = () =>
  import("../../components/group/display/GroupDetails");
const QuizDetails = () => import("../../components/Quiz/QuizDetails");
const NewQuiz = () => import("../../components/Quiz/NewQuiz");

const InstructorRoutes = () => {
  return (
    <Route
      index
      element={
        <ProtectedRoute
          element={
            <Suspense fallback={<Loading />}>
              <InstructorLayout />
            </Suspense>
          }
          expectedRoles={["instructor"]}
        />
      }>
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
    </Route>
  );
};

export default InstructorRoutes;
