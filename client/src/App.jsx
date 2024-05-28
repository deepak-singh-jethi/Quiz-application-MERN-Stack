import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Root from "./RouterLayout/Root";
import ProtectedRoute from "./RouterLayout/ProtectedRoute";
import HomeLayout from "./RouterLayout/HomeLayout";
import AuthLayout, { action as AuthAction } from "./RouterLayout/AuthLayout";

// Define router with all routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {/* Public Routes */}
      <Route path="auth" element={<AuthLayout />} action={AuthAction} />
      <Route path="notAuthorized" element={<div>Not Authorized</div>} />

      {/* Protected Home layout Route */}
      <Route
        index
        element={
          <ProtectedRoute
            element={<HomeLayout />}
            expectedRoles={["admin", "user"]}
          />
        }
      />

      {/* Admin Routes */}
      <Route path="admin">
        <Route
          path="quizzes"
          element={
            <ProtectedRoute
              element={<h1>All Quiz</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="quizzes/createQuiz"
          element={
            <ProtectedRoute
              element={<h1>Create Quiz Page</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="quizzes/editQuiz"
          element={
            <ProtectedRoute
              element={<h1>Edit Quiz</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="results"
          element={
            <ProtectedRoute
              element={<h1>Results</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="results/:id"
          element={
            <ProtectedRoute
              element={<h1>1 Result</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute
              element={<h1>Students page</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
        <Route
          path="students/:studentId"
          element={
            <ProtectedRoute
              element={<h1>Student Detail</h1>}
              expectedRoles={["admin"]}
            />
          }
        />
      </Route>

      {/* User Routes */}
      <Route path="user">
        <Route
          path="quizzes"
          element={
            <ProtectedRoute
              element={<h1>All quizzes</h1>}
              expectedRoles={["user"]}
            />
          }
        />
        <Route
          path="quizzes/:quizId"
          element={
            <ProtectedRoute element={<h1>Quiz</h1>} expectedRoles={["user"]} />
          }
        />
        <Route
          path="results"
          element={
            <ProtectedRoute
              element={<h1>My Results</h1>}
              expectedRoles={["user"]}
            />
          }
        />
        <Route
          path="results/:quizId"
          element={
            <ProtectedRoute
              element={<h1>MY 1 Quiz Result</h1>}
              expectedRoles={["user"]}
            />
          }
        />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
