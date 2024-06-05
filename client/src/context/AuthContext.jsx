import React, { useState, createContext } from "react";

export const AuthContext = createContext({
  token: "xxxxx",
  role: "xxxxx",
  name: "xxxxx",
  email: "xxxxx",
  id: "xxxxx",
  logout: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({
    name: "",
    email: "",
    id: "",
    role: "",
  });

  const { name, email, id, role } = user;

  const logout = () => {
    setToken(null);
    setRole(null);
  };
  const login = (token, role, name, email, id) => {
    setToken(token);
    setUser({ name, email, id, role });
  };

  return (
    <AuthContext.Provider
      value={{ token, role, name, email, id, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
