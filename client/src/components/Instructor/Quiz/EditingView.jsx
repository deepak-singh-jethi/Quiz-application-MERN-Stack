import React, { memo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaSave } from "react-icons/fa";
import QuizInput from "./QuizInput";
import { authorizedUpdater, queryClient } from "../../../utils/http.js";
import Loading from "../../../components/ui/Loading.jsx";
import ErrorBlock from "../../../components/ui/ErrorBlock.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";

const EditingView = ({ question, toggleEditQuestion }) => {
  const { quizId } = useParams();
  const [qus, setQus] = useState(question);
  const { token } = useContext(AuthContext);

  const {
    mutate,
    isLoading: mutationIsLoading,
    isError: mutationIsError,
    error: mutationError,
    isPending: mutationPending,
  } = useMutation({
    mutationFn: authorizedUpdater,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", { id: quizId }],
      });
    },
    onSuccess: () => {
      toggleEditQuestion(qus.id);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "question") {
      setQus((prevQus) => ({
        ...prevQus,
        question: value,
      }));
    } else if (name.startsWith("option")) {
      const index = parseInt(name.replace("option", ""));
      setQus((prevQus) => {
        const updatedOptions = [...prevQus.options];
        const wasCorrectAnswer =
          updatedOptions[index] === prevQus.correctAnswer;
        updatedOptions[index] = value;
        return {
          ...prevQus,
          options: updatedOptions,
          correctAnswer: wasCorrectAnswer ? value : prevQus.correctAnswer,
        };
      });
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setQus((prevQus) => ({
      ...prevQus,
      correctAnswer: value,
    }));
  };

  const handleSave = () => {
    mutate({
      URL: `http://localhost:3000/api/v1/quiz/questions/${qus.id}`,
      body: qus,
      token: token,
    });
  };
  if (mutationIsLoading) {
    return <Loading>Loading...</Loading>;
  }
  if (mutationIsError) {
    return <ErrorBlock message={mutationError.message} />;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <QuizInput
        label="Question"
        name="question"
        value={qus.question}
        onChange={handleInputChange}
      />
      {qus.options.map((option, oIndex) => (
        <QuizInput
          key={oIndex}
          label={`Option ${oIndex + 1}`}
          name={`option${oIndex}`}
          value={option}
          onChange={handleInputChange}
        />
      ))}
      <div className="mb-4">
        <label className="block text-sm font-medium">Correct Answer</label>
        <select
          name="correctAnswer"
          value={qus.correctAnswer}
          onChange={handleSelectChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900">
          {qus.options.map((option, oIndex) => (
            <option key={oIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => toggleEditQuestion(qus.id)}
          className="bg-gray-500 text-white py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-600">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-4 rounded transition duration-300 ease-in-out hover:from-blue-600 hover:to-teal-500"
          disabled={mutationPending}>
          <FaSave className="inline mr-2" />{" "}
          {mutationPending ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default memo(EditingView);
