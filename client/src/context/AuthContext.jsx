import React, { useState, createContext } from "react";

export const AuthContext = createContext({
  token: "xxxxx",
  role: "xxxxx",
  logout: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const logout = () => {
    setToken(null);
    setRole(null);
  };
  const login = (token, role) => {
    setToken(token);
    setRole(role);
  };

  return (
    <AuthContext.Provider value={{ token, role, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
