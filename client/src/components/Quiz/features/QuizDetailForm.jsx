import React, { useState, useContext } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  queryClient,
  authorizedCreator,
  authorizedUpdater,
} from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import QuizInput from "../QuizInput";
import Button1 from "../../ui/Button1";
import { AuthContext } from "../../../context/AuthContext";

const QuizDetailForm = ({ data, setEditingQuiz, state }) => {
  const { quizId } = useParams();
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    mutate: updateQuiz,
    data: updateData,
    isPending: updatePending,
    isError: isErrorOnUpdate,
    error: updateError,
  } = useMutation({
    mutationFn: authorizedUpdater,
    onSuccess: () => {
      queryClient.invalidateQueries([
        ["live", "quizzes"],
        ["upcoming", "quizzes"],
        ["quiz", { id: quizId }],
      ]);
      setEditingQuiz(false);
      navigate(`/admin/quizzes/${quizId}`);
    },
  });

  // TODO create a new quiz using this mutation
  // const {
  //   mutate: createQuiz,
  //   data: createData,
  //   isPending: createPending,
  //   isError: isErrorOnCreate,
  //   error: createError,
  // } = useMutation({
  //   mutationFn: authorizedCreator,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([
  //       ["live", "quizzes"],
  //       ["upcoming", "quizzes"],
  //     ]);
  //     navigate("/admin/dashboard");
  //   },
  // });

  const {
    quiz: { name, duration, perQusMarks, topics },
  } = data;
  const [formData, setFormData] = useState({
    name: name || "",
    duration: duration || 0,
    perQusMarks: perQusMarks || 1,
    topics: topics || [],
  });
  const [formError, setFormError] = useState("");

  const handleSubmit = () => {
    //handle errors such that no fields can be empty

    if (
      !formData.name ||
      !formData.duration ||
      !formData.perQusMarks ||
      !formData.topics.join("")
    ) {
      setFormError("Please fill all the fields");
      return;
    }
    setFormError("");
    if (state === "update") {
      updateQuiz({
        URL: `http://localhost:3000/api/v1/quiz/${quizId}`,
        body: {
          ...formData,
        },
        token: token,
      });
    }
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <QuizInput
          label="Name"
          name="name"
          value={formData.name}
          placeholder="Enter quiz name"
          onChange={(e) => {
            setFormData({
              ...formData,
              [e.target.name]: e.target.value,
            });
          }}
        />
        <QuizInput
          label="Duration in Minutes"
          name="duration"
          type="number"
          value={formData.duration}
          placeholder="Enter quiz duration in Minutes"
          onChange={(e) => {
            setFormData({
              ...formData,
              [e.target.name]: e.target.value,
            });
          }}
        />
        <QuizInput
          label="Per Question Marks"
          name="perQusMarks"
          type="number"
          value={formData.perQusMarks}
          onChange={(e) => {
            setFormData({
              ...formData,
              [e.target.name]: e.target.value,
            });
          }}
        />
        <QuizInput
          label="Topic (js, Java, Oops)"
          name="topics"
          value={formData.topics.join(", ")}
          onChange={(e) => {
            setFormData({
              ...formData,
              topics: e.target.value.trim().split(", "),
            });
          }}
        />
      </div>
      <div className="h-10 text-center">
        {formError && <p className="text-red-500 col-span-2">{formError}</p>}
        {updateError && (
          <p className="text-red-500 col-span-2">{updateError.message}</p>
        )}
        {/* TODO  later add createError also */}
      </div>
      <div className="flex justify-between items-center min-w-full">
        <button
          onClick={() => setEditingQuiz(false)}
          className="bg-orange-500 px-3 py-2 hover:bg-orange-600 text-white rounded">
          <MdCancel className="inline mr-2" /> Cancel
        </button>
        <Button1 onClick={handleSubmit}>
          <FaSave className="inline mr-2" /> Save
        </Button1>
      </div>
    </div>
  );
};

export default QuizDetailForm;
