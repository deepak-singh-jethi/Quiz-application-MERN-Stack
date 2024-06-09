import React, { useContext, lazy, Suspense } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/ui/MainLayout";

// Lazy load dashboard components
const AdminDashboard = lazy(() =>
  import("../components/admin/dashboard/AdminDashboard")
);
const UserDashboard = lazy(() =>
  import("../components/users/dashboard/UserDashboard")
);
const InstructorDashboard = lazy(() =>
  import("../components/Instructor/dashboard/InstructorDashboard")
);

const HomeLayout = () => {
  const { role } = useContext(AuthContext);

  let DashboardComponent;

  if (role === "admin") {
    DashboardComponent = AdminDashboard;
  } else if (role === "user") {
    DashboardComponent = UserDashboard;
  } else if (role === "instructor") {
    DashboardComponent = InstructorDashboard;
  }

  return (
    // Wrap with MainLayout and use Suspense for lazy loading fallback
    <MainLayout>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        {DashboardComponent ? (
          <DashboardComponent />
        ) : (
          <div>No dashboard available</div>
        )}
      </Suspense>
    </MainLayout>
  );
};

export default HomeLayout;
