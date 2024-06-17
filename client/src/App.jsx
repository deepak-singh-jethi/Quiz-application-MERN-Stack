import React, { lazy, Suspense } from "react";
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

// Layouts
import HomeLayout from "./RouterLayout/HomeLayout";
import AuthLayout from "./RouterLayout/AuthLayout";

// Lazy load layouts
const AdminLayout = lazy(() => import("./RouterLayout/AdminLayout.jsx"));
const UserLayout = lazy(() => import("./RouterLayout/UserLayout.jsx"));
const InstructorLayout = lazy(() =>
  import("./RouterLayout/InstructorLayout.jsx")
);

// Quiz components
const QuizDetails = lazy(() => import("./components/Quiz/QuizDetails.jsx"));
const NewQuiz = lazy(() => import("./components/Quiz/NewQuiz.jsx"));
const InstructorAllQuizzesArea = lazy(() =>
  import("./components/Instructor/quizzesBoard/InstructorAllQuizzesArea.jsx")
);
const AdminAllQuizzesArea = lazy(() =>
  import("./components/admin/quizzesBoard/AdminAllQuizzesArea.jsx")
);

// UI components
const ErrorPage = lazy(() => import("./components/ui/ErrorPage.jsx"));
const UnauthorizedPage = lazy(() =>
  import("./components/ui/UnauthorizedPage.jsx")
);

// Fallback for Suspense
import Loading from "./components/ui/Loading.jsx";
const AdminAllGroupArea = lazy(() =>
  import("./components/admin/groupBoard/AdminAllGroupArea.jsx")
);
const InstructorAllGroupArea = lazy(() =>
  import("./components/Instructor/groupBoard/InstructorAllGroupArea.jsx")
);
const GroupDetails = lazy(() =>
  import("./components/group/display/GroupDetails.jsx")
);

// Define router with all routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      {/* Public Routes */}
      <Route path="auth" element={<AuthLayout />} />
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
      {/* Admin Routes  with lazy loading*/}

      <Route
        path="admin"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <AdminLayout />
              </Suspense>
            }
            expectedRoles={["admin"]}
          />
        }>
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
        <Route path="teachers" element={<h1>Teachers</h1>} />
        <Route
          path="teachers/:teachersId"
          element={<h1>Teacher number 1</h1>}
        />
        <Route
          path="teachers/:createTeacher"
          element={<h1>Add new Teacher form</h1>}
        />
      </Route>

      {/* Instructor Routes */}
      <Route
        path="instructor"
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

      {/* User Routes */}
      <Route
        path="user"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <UserLayout />
              </Suspense>
            }
            expectedRoles={["user"]}
          />
        }>
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
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

{
  /* Admin Routes  with lazy loading*/
}
{
  /* <Route
        path="admin"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <AdminLayout />
              </Suspense>
            }
            expectedRoles={["admin"]}
          />
        }>
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
        <Route path="teachers" element={<h1>Teachers</h1>} />
        <Route
          path="teachers/:teachersId"
          element={<h1>Teacher number 1</h1>}
        />
        <Route
          path="teachers/:createTeacher"
          element={<h1>Add new Teacher form</h1>}
        />
      </Route> */
}

{
  /* Instructor Routes */
}
{
  /* <Route
        path="instructor"
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
      </Route> */
}

{
  /* User Routes */
}
{
  /* <Route
        path="user"
        element={
          <ProtectedRoute
            element={
              <Suspense fallback={<Loading />}>
                <UserLayout />
              </Suspense>
            }
            expectedRoles={["user"]}
          />
        }>
        <Route path="quizzes" element={<h1>Quizzes</h1>} />
        <Route
          path="quizzes/:quizId"
          element={
            <Suspense fallback={<Loading />}>
              <QuizDetails />
            </Suspense>
          }
        />
        <Route path="results" element={<h1>My Results</h1>} />
        <Route path="results/:quizId" element={<h1>MY 1 Quiz Result</h1>} />
      </Route> */
}
