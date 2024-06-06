import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http.js";

import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Root from "./RouterLayout/Root";
import ProtectedRoute from "./utils/HigerOrderComponent/ProtectedRoute.jsx";
// layout
import HomeLayout from "./RouterLayout/HomeLayout";
import AuthLayout, { action as AuthAction } from "./RouterLayout/AuthLayout";
import AdminLayout from "./RouterLayout/AdminLayout.jsx";
import UserLayout from "./RouterLayout/UserLayout.jsx";
import InstructorLayout from "./RouterLayout/InstructorLayout.jsx";
//

import QuizDetails from "./components/Quiz/QuizDetails.jsx";

//
import ErrorPage from "./components/ui/ErrorPage.jsx";
import UnauthorizedPage from "./components/ui/UnauthorizedPage.jsx";

// Define router with all routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      {/* Public Routes */}
      <Route path="auth" element={<AuthLayout />} action={AuthAction} />
      <Route path="notAuthorized" element={<UnauthorizedPage />} />

      {/* Protected Home layout Route */}
      <Route
        index
        element={
          <ProtectedRoute
            element={<HomeLayout />}
            expectedRoles={["admin", "user", "instructor"]}
          />
        }
      />

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute element={<AdminLayout />} expectedRoles={["admin"]} />
        }>
        <Route path="quizzes" element={<h1>All Quiz</h1>} />
        <Route path="quizzes/:quizId" element={<QuizDetails />} />
        <Route
          path="quizzes/createQuiz/:quizId"
          element={<h1>Create Quiz Page</h1>}
        />
        <Route path="quizzes/editQuiz/:quizId" element={<h1>Edit Quiz</h1>} />
        <Route path="results" element={<h1>Results</h1>} />
        <Route path="results/:id" element={<h1>1 Result</h1>} />
        <Route path="students" element={<h1>Students page</h1>} />
        <Route path="students/:studentId" element={<h1>Student Detail</h1>} />
        <Route path="teachers" element={<h1>Teachers</h1>} />
        <Route
          path="teachers/:teachersId"
          element={<h1> Teacher number 1</h1>}
        />
      </Route>
      {/* Instructor Routes */}
      <Route
        path="instructor"
        element={
          <ProtectedRoute
            element={<InstructorLayout />}
            expectedRoles={["instructor"]}
          />
        }>
        <Route path="quizzes" element={<h1>Quizzes</h1>} />
        <Route path="quizzes/:quizId" element={<QuizDetails />} />
        <Route path="quizzes/editQuiz/:quizId" element={<h1>Edit Quiz</h1>} />
        <Route path="quizzes/createQuiz" element={<h1>Create Quiz Page</h1>} />

        <Route path="results" element={<h1>Results</h1>} />
        <Route path="results/:id" element={<h1>1 Result</h1>} />
        <Route path="students/:studentId" element={<h1>Student Detail</h1>} />
      </Route>

      {/* User Routes */}
      <Route
        path="user"
        element={
          <ProtectedRoute element={<UserLayout />} expectedRoles={["user"]} />
        }>
        <Route path="quizzes" element={<h1>Quizzes</h1>} />
        <Route path="quizzes/:quizId" element={<h1>Quiz</h1>} />
        <Route path="results" element={<h1>My Results</h1>} />
        <Route path="results/:quizId" element={<h1>MY 1 Quiz Result</h1>} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
