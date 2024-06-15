import React, { useState, useContext, memo } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  queryClient,
  authorizedCreator,
  authorizedUpdater,
} from "../../../utils/http";
import QuizInput from "../QuizInput";
import Button1 from "../../ui/Button1";
import { AuthContext } from "../../../context/AuthContext";
import Loading from "../../ui/Loading";

const QuizDetailForm = ({ data, setEditingQuiz, state }) => {
  const { quizId } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: data.quiz.name || "",
    duration: data.quiz.duration || "",
    perQusMarks: data.quiz.perQusMarks || 1,
    topics: data.quiz.topics || [],
  });
  const [formError, setFormError] = useState("");

  const commonMutationConfig = {
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries([
        ["AllLiveQuizzes"],
        ["AllUpcomingQuizzes"],
        ["AllResultedQuizzes"],
        ["6-live-quizzes"],
        ["5-upcoming-quizzes"],
        ["quiz", { id: quizId }],
      ]);
      if (state === "update") {
        setEditingQuiz(false);
        navigate(`/${role}/quizzes/${quizId}`);
      } else {
        navigate(`/${role}/quizzes/${response.quiz.id}`);
      }
    },
    onError: (error) => {
      setFormError(error.message || "An error occurred");
    },
  };

  const updateQuiz = useMutation({
    mutationFn: authorizedUpdater,
    ...commonMutationConfig,
  });

  const createQuiz = useMutation({
    mutationFn: authorizedCreator,
    ...commonMutationConfig,
  });

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.duration ||
      isNaN(formData.duration) ||
      formData.duration < 0 ||
      !formData.perQusMarks ||
      isNaN(formData.perQusMarks) ||
      formData.perQusMarks < 0 ||
      !formData.topics.join("")
    ) {
      setFormError("Please fill all the fields");
      return;
    }

    setFormError("");

    const payload = {
      URL:
        state === "update"
          ? `http://localhost:3000/api/v1/quiz/${quizId}`
          : "http://localhost:3000/api/v1/quiz",
      body: formData,
    };

    if (state === "update") {
      updateQuiz.mutate(payload);
    } else {
      createQuiz.mutate(payload);
    }
  };

  if (updateQuiz.isLoading || createQuiz.isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <QuizInput
          label="Name"
          name="name"
          value={formData.name}
          placeholder="Enter quiz name"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <QuizInput
          label="Duration in Min"
          name="duration"
          type="number"
          value={formData.duration}
          placeholder="Enter quiz duration in Minutes"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <QuizInput
          label="Per Question Marks"
          name="perQusMarks"
          type="number"
          value={formData.perQusMarks}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <QuizInput
          label="Topic (js, Java, Oops)"
          name="topics"
          value={formData.topics.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              topics: e.target.value.split(", "),
            })
          }
        />
      </div>
      {formError && (
        <p className="text-red-500 text-center mt-2">{formError}</p>
      )}
      <div className="flex justify-between items-center min-w-full mt-4">
        {state === "update" ? (
          <>
            <button
              onClick={() => setEditingQuiz(false)}
              className="bg-orange-500 px-3 py-2 hover:bg-orange-600 text-white rounded">
              <MdCancel className="inline mr-2" /> Cancel
            </button>
            <Button1 onClick={handleSubmit}>
              <FaSave className="inline mr-2" /> Save
            </Button1>
          </>
        ) : (
          <>
            <Link
              className="bg-orange-500 px-3 py-2 hover:bg-orange-600 text-white rounded"
              to={`/${role}/quizzes`}
              relative="route">
              Cancel
            </Link>
            <Button1 onClick={handleSubmit}>
              <FaSave className="inline mr-2" /> Create
            </Button1>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(QuizDetailForm);
