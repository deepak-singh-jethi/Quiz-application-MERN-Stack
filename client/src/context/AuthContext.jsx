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

const initialState = {
  role: "",
  name: "",
  email: "",
  id: "",
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(initialState);

  const { name, email, id, role } = user;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    setToken(null);
    setUser(initialState);
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
