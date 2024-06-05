import React, { useState } from "react";
import QuizInput from "./QuizInput";
import Button1 from "../../ui/Button1";

const AddNewQus = ({ addQuestion, onCancel, quiz }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleOptionChange = (index, e) => {
    const { value } = e.target;
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    // addQuestion(newQuestion);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-700 my-5">
      <div className="w-full text-center">
        <h3 className="font-semibold text-2xl mb-6">Add New Question</h3>
      </div>

      <QuizInput
        label="Question"
        name="question"
        value={newQuestion.question}
        onChange={handleQuestionChange}
      />
      {newQuestion.options.map((option, index) => (
        <QuizInput
          key={index}
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e)}
        />
      ))}
      <div className="mb-4">
        <label className="block text-sm font-medium">Correct Answer</label>
        <select
          name="correctAnswer"
          value={newQuestion.correctAnswer}
          onChange={handleQuestionChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900">
          {newQuestion.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {/*  trigger mutate fun  to add a new qus to database and quiz*/}
      <Button1 onClick={handleAddQuestion}>Add</Button1>
      <button
        className="bg-gradient-to-r  from-red-500 to-red-400 text-white py-2 px-4 min-w-[140px] rounded transition duration-300 ease-in-out hover:from-red-600 hover:to-red-600 ml-7"
        onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default AddNewQus;
