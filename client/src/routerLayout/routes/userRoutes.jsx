import React, { Suspense } from "react";
import { Route } from "react-router";
import Loading from "../../components/ui/Loading";

export const userRoutes = () => {
  return (
    <>
      <Route path="quizzes" element={<h1>Quizzes</h1>} />
      <Route
        path="quizzes/:quizId"
        element={
          <Suspense fallback={<Loading />}>
            <h1>User Quiz Details</h1>
          </Suspense>
        }
      />
      <Route path="results" element={<h1>My Results</h1>} />
      <Route path="results/:quizId" element={<h1>MY 1 Quiz Result</h1>} />
    </>
  );
};
