import React, { useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authorizer } from "../utils/http";

const Auth = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [operation, setOperation] = useState("login");

  const {
    mutate,
    isPending,
    isError,
    error: authError,
  } = useMutation({
    mutationFn: authorizer,
    onSuccess: ({ loggedInUser }) => {
      const { role, name, email, id } = loggedInUser;
      login({ role, name, email, id });
      navigate("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Utility function to get input classes
  const getInputClasses = (hasError) =>
    `border px-4 py-2 mt-2 focus:ring-2 focus:ring-blue-500 outline-none font-serif rounded-lg w-full transition duration-300 ease-in-out ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300"
    }`;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any existing error messages

    const { name, email, password, confirmPassword } = formData;

    // Validation based on operation (login or register)
    if (operation === "register") {
      if (!name || !email || !password || !confirmPassword) {
        setError("All fields are required for registration");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    } else if (operation === "login") {
      if (!email || !password) {
        setError("Email and password are required for login");
        return;
      }
    }

    // Prepare body based on operation (login or register)
    const body =
      operation === "login"
        ? { email, password }
        : { name, email, password, confirmPassword };

    // Call the mutation
    mutate({
      URL: `http://localhost:3000/api/v1/users/${
        operation === "login" ? "login" : "register"
      }`,
      body: body,
    });
  };

  // Toggle between login and register
  const toggleOperation = () => {
    setOperation((prevOperation) =>
      prevOperation === "login" ? "register" : "login"
    );
    setError(""); // Clear error when switching
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
          Career Launcher Dehradun
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {operation === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={getInputClasses(error)}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={getInputClasses(error)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={getInputClasses(error)}
          />
          {operation === "register" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={getInputClasses(error)}
            />
          )}
          <button
            type="submit"
            className="my-4 bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={isPending}>
            {operation === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {operation === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={toggleOperation}
            className="text-blue-600 font-semibold hover:underline transition duration-300 ease-in-out">
            {operation === "login" ? "Register" : "Login"}
          </button>
        </p>
        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
