import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, expectedRoles }) => {
  const { isAuthenticated, isAuthChecked, role, id } = useContext(AuthContext);

  const navigate = useNavigate();
  const isRoleExist = expectedRoles.includes(role);

  useEffect(() => {
    // Check if isAuthenticated is false and navigate to login page
    if (!isAuthenticated && isAuthChecked) {
      navigate("/auth");
    } else if (!isRoleExist && isAuthChecked) {
      navigate("/notAuthorized");
    }
  }, [role, id, isAuthenticated, isAuthChecked]);

  // Render the protected route only if authentication check is complete and isAuthenticated is true
  return isAuthChecked && isAuthenticated ? element : null;
};

export default ProtectedRoute;
