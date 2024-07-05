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

// main root page
import Root from "./routerLayout/Root.jsx";

// HOC for Protection of routes
import ProtectedRoute from "./utils/HigerOrderComponent/ProtectedRoute.jsx";

// Layouts
import HomeLayout from "./routerLayout/HomeLayout.jsx";
import AuthLayout from "./routerLayout/AuthLayout.jsx";

// Lazy load Main layouts
const AuthProvider = lazy(() => import("./context/AuthContext.jsx"));
const AdminLayout = lazy(() => import("./routerLayout/AdminLayout.jsx"));
const UserLayout = lazy(() => import("./routerLayout/UserLayout.jsx"));
const InstructorLayout = lazy(() =>
  import("./routerLayout/InstructorLayout.jsx")
);

// routes function which return routes for different roles
import { adminRoutes } from "./routerLayout/routes/adminRoutes.jsx";
import { instructorRoutes } from "./routerLayout/routes/instructorRoutes.jsx";
import { userRoutes } from "./routerLayout/routes/userRoutes.jsx";

// UI components
const ErrorPage = lazy(() => import("./components/ui/ErrorPage.jsx"));
const UnauthorizedPage = lazy(() =>
  import("./components/ui/UnauthorizedPage.jsx")
);
import Loading from "./components/ui/Loading.jsx";

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
        {adminRoutes()}
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
        {instructorRoutes()}
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
        {userRoutes()}
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
