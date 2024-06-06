import React from "react";
import QuizInput from "./QuizInput";
import Button1 from "../ui/Button1";
import { FaSave } from "react-icons/fa";

const QuizDetailEdit = ({ data, setEditingQuiz }) => {
  const handleQuizDetailChange = (e) => {};
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <QuizInput
        label="Name"
        name="name"
        value={data.quiz.name}
        onChange={handleQuizDetailChange}
      />
      <QuizInput
        label="Duration"
        name="duration"
        type="number"
        value={data.quiz.duration}
        onChange={handleQuizDetailChange}
      />
      <QuizInput
        label="Per Question Marks"
        name="perQusMarks"
        type="number"
        value={data.quiz.perQusMarks}
        onChange={handleQuizDetailChange}
      />
      <QuizInput
        label="Topics"
        name="topics"
        value={data.quiz.topics.join(", ")}
        onChange={(e) =>
          handleQuizDetailChange({
            target: {
              name: "topics",
              value: e.target.value.split(", "),
            },
          })
        }
      />
      <Button1 onClick={() => setEditingQuiz(false)}>
        <FaSave className="inline mr-2" /> Save
      </Button1>
    </div>
  );
};

export default QuizDetailEdit;
