import { useParams } from "react-router-dom";
import React, { useState, useContext, memo, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { authorizedCreator, queryClient } from "../../../utils/http";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthContext";

import QuizInput from "../QuizInput";
import Button1 from "../../ui/Button1";
import SearchAddQus from "./SearchAddQus";
import { topics } from "../../../utils/topics";

const AddNewQus = ({ addQuestion, onCancel, quiz }) => {
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    topic: "",
  });
  const [error2, setError2] = useState(null);
  const [topicInput, setTopicInput] = useState("");
  const [isNewQus, setQus] = useState(true);

  const { role } = useContext(AuthContext);
  const selectedTopic = useRef([]);

  const { quizId } = useParams();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: authorizedCreator,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", { id: quizId }] });
    },
    onSuccess: () => {
      navigate(`/${role}/quizzes/${quiz.id}`);
    },
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index === null) {
      setNewQuestion({ ...newQuestion, [name]: value });
    } else {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    }
  };

  const handleAddQuestion = () => {
    if (
      newQuestion.options.includes("") ||
      newQuestion.options.includes(undefined) ||
      newQuestion.options.includes(null) ||
      newQuestion.correctAnswer === "" ||
      newQuestion.topic === ""
    ) {
      setError2("Please fill all the fields");
      return;
    }
    mutate({
      URL: `http://localhost:3000/api/v1/questions/${quizId}`,
      body: [newQuestion],
    });
  };

  useEffect(() => {
    if (topicInput.length > 1) {
      selectedTopic.current = topics.filter((topic) => {
        return topic.toLowerCase().includes(topicInput.toLowerCase());
      });
    } else {
      selectedTopic.current = [];
    }
  }, [topicInput]);

  const handleTopicSelect = (topic) => {
    if (newQuestion.topic === topic) {
      setNewQuestion({ ...newQuestion, topic: "" });
    } else {
      setNewQuestion({ ...newQuestion, topic });
    }
  };

  return (
    <>
      {/* two buttons to switch between add new question and search question by modifying isNewQus */}
      <div className="flex justify-center md:gap-6 gap-4">
        <Button1
          onClick={() => setQus(true)}
          className={`${
            isNewQus ? "bg-green-500" : "bg-gray-500"
          } text-white px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 text-sm md:text-md`}>
          Add a new Questions
        </Button1>
        <Button1
          onClick={() => setQus(false)}
          className={`${
            isNewQus ? "bg-gray-500" : "bg-green-500"
          } text-white px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 text-sm md:text-md`}>
          Use Qus Bank
        </Button1>
      </div>
      {isNewQus && (
        <div className="bg-white md:p-6 p-3 rounded-lg shadow-md text-gray-700 my-5">
          <div className="w-full text-center">
            <h3 className="font-semibold text-2xl mb-3">Add New Question</h3>
          </div>

          {/* question */}
          <QuizInput
            label="Question"
            name="question"
            value={newQuestion.question}
            onChange={handleChange}
            placeholder="Enter your question"
          />
          {/* 4 - options */}
          {newQuestion.options.map((option, index) => (
            <QuizInput
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleChange(e, index)}
              placeholder={`Option ${index + 1}`}
            />
          ))}

          <div className="relative">
            <div className="">
              <label className="block text-green-400 text-sm font-bold mb-2">
                Selected Topics:
              </label>
              {/* already selected Topics */}
              {newQuestion.topic && (
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {newQuestion.topic}
                  <button
                    type="button"
                    className="ml-2 text-gray-600 hover:text-gray-800"
                    onClick={() => handleTopicSelect(newQuestion.topic)}>
                    &times;
                  </button>
                </span>
              )}
            </div>

            {/* input for topic */}
            <QuizInput
              label="Topic (js, Java, Oops)"
              name="topics"
              value={topicInput}
              placeholder="Enter quiz topics"
              onChange={(e) => setTopicInput(e.target.value)}
            />
          </div>

          {/* show only 5 topics in UI */}
          {selectedTopic.current.length > 0 && (
            <div className="">
              {selectedTopic.current.slice(0, 5).map((topic, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  onClick={() => handleTopicSelect(topic)}>
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* correct and input using select tag where any one of the options will get selected  */}
          <div className="mb-4">
            <label className="block text-sm md:text-md font-bold my-1">
              Correct Answer
            </label>
            <select
              name="correctAnswer"
              value={newQuestion.correctAnswer}
              onChange={handleChange}
              className="py-2 px-4 block w-full rounded-md border-2 border-red-400 shadow-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900">
              {newQuestion.options.concat([""]).map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/*  trigger mutate fun  to add a new qus to database and quiz*/}
          {isError && (
            <p className="my-3 text-center text-red-600 font-semibold">
              {error.message}
            </p>
          )}
          {error2 && (
            <p className="my-3 text-red-600 text-center font-semibold">
              {error2}
            </p>
          )}

          <div className="flex sm:justify-center items-center justify-between">
            <Button1 onClick={handleAddQuestion}>Add</Button1>
            <button
              className="bg-gradient-to-r  from-red-500 to-red-400 text-white py-2 px-3 min-w-[120px] rounded transition duration-300 ease-in-out hover:from-red-600 hover:to-red-600 ml-2 md:ml-7"
              onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* search question from qus bank */}
      {!isNewQus && (
        <SearchAddQus quizTopics={quiz.topics} quizQuestions={quiz.questions} />
      )}
    </>
  );
};

export default memo(AddNewQus);
