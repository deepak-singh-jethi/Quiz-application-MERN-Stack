import React, { memo, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, expectedRoles }) => {
  const { login } = useContext(AuthContext);

  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  let name = localStorage.getItem("name");
  let email = localStorage.getItem("email");
  let id = localStorage.getItem("id");

  const navigate = useNavigate();
  const isRoleExist = expectedRoles.includes(role);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else if (!isRoleExist) {
      navigate("/notAuthorized");
    }
    if (token && role) {
      login(token, role, name, email, id);
    }
  }, [token, role]);

  return element;
};

export default ProtectedRoute;
