import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

// Create the AuthContext
export const AuthContext = createContext({
  role: "",
  name: "",
  email: "",
  id: "",
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
});

const initialState = {
  role: "",
  name: "",
  email: "",
  id: "",
  isAuthenticated: false,
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error);

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/users/refreshToken");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  const { name, email, id, role } = user;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const logout = async () => {
    try {
      await axiosInstance.post("http://localhost:3000/api/v1/users/logout");
      setUser(initialState);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const login = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setIsAuthChecked(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3000/api/v1/users/getMe"
        );
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        setIsAuthChecked(true);
      } catch (error) {
        setIsAuthChecked(true);
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        name,
        email,
        id,
        isAuthenticated,
        isAuthChecked,
        logout,
        login,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
