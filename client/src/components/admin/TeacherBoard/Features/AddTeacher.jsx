import React, { useState } from "react";
import { queryClient, authorizedCreator } from "../../../../utils/http";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import QuizInput from "../../../quiz/QuizInput";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState(null);

  const { mutate, isPending, isError, error, data } = useMutation({
    mutationFn: authorizedCreator,
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      navigate("/admin/teachers");
      setFormError(null);
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  // handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // check if any input is empty
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setFormError("Please fill all the fields");
      return;
    }

    // validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    mutate({
      URL: "http://localhost:3000/api/v1/admin/newInstructor",
      body: formData,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center font-bold text-md lg:text-xl text-2xl my-4">
        Add a New Teacher
      </h1>

      <div>
        <form
          className="bg-gray-700  px-4 md:mx-6 py-3 w-[300px] sm:w-[400px] md:w-[450px] rounded-lg "
          onSubmit={handleSubmit}>
          <QuizInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            label="Name"
          />
          <QuizInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            label="Email"
          />
          <QuizInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            label="Password"
            required
          />
          <QuizInput
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            label="Confirm Password"
            required
          />
          <div className="h-6">
            {formError && <p className="text-red-500">{formError}</p>}
          </div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center my-4 w-full">
            {isPending ? "Adding..." : "Add Teacher"}
          </button>
        </form>
      </div>
      <Link
        to="/admin/teachers"
        className="mt-4 underline text-blue-600 font-semibold">
        Back
      </Link>
    </div>
  );
};

export default AddTeacher;
