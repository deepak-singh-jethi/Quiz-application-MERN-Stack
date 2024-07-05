import ProtectedRoute from "../../utils/HigerOrderComponent/ProtectedRoute.jsx";
import React, { lazy, Suspense } from "react";

import { Route, Routes } from "react-router-dom";

import Loading from "../../components/ui/Loading.jsx";
const AdminLayout = lazy(() => import("../AdminLayout.jsx"));
const AdminAllQuizzesArea = lazy(() =>
  import("../../components/admin/quizzesBoard/AdminAllQuizzesArea.jsx")
);
const QuizDetails = lazy(() => import("../../components/quiz/QuizDetails.jsx"));

const NewQuiz = lazy(() => import("../../components/quiz/NewQuiz.jsx"));

const GroupDetails = lazy(() =>
  import("../../components/group/display/GroupDetails.jsx")
);
const AdminAllGroupArea = lazy(() =>
  import("../../components/admin/groupBoard/AdminAllGroupArea.jsx")
);
const TeachersArea = lazy(() =>
  import("../../components/admin/TeacherBoard/Display/TeachersArea.jsx")
);
const AddTeacher = lazy(() =>
  import("../../components/admin/TeacherBoard/Features/AddTeacher.jsx")
);
const TeacherInfo = lazy(() =>
  import("../../components/admin/TeacherBoard/Display/TeacherInfo.jsx")
);

export const adminRoutes = () => {
  return (
    <>
      <Route
        path="quizzes"
        element={
          <Suspense fallback={<Loading />}>
            <AdminAllQuizzesArea />
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
            <AdminAllGroupArea />
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
      <Route
        path="groups/createNewGroup"
        element={
          <Suspense fallback={<Loading />}>
            <h1>create new Group</h1>
          </Suspense>
        }
      />

      <Route path="results" element={<h1>Results</h1>} />
      <Route path="results/:id" element={<h1>1 Result</h1>} />
      <Route path="students" element={<h1>Students page</h1>} />
      <Route path="students/:studentId" element={<h1>Student Detail</h1>} />
      <Route path="teachers">
        <Route index element={<TeachersArea />} />
        <Route path="new" element={<AddTeacher />} />
        <Route path=":id" element={<TeacherInfo />} />
      </Route>
    </>
  );
};
