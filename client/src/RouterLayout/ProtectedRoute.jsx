import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, expectedRoles }) => {
  const { login } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const isRoleExist = expectedRoles.includes(role);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else if (!isRoleExist) {
      navigate("/notAuthorized");
    }
    if (token && role) {
      login(token, role);
    }
  }, [token, role]);

  return element;
};

export default ProtectedRoute;
