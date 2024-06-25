import React, { memo } from "react";
import QuizDetailForm from "./features/QuizDetailForm";
const data = {
  quiz: {
    name: "",
    duration: 0,
    perQusMarks: 0,
    topics: [],
  },
};

const NewQuiz = () => {
  return (
    <div className="mx-4 px-4 py-2 border-2 border-gray-800 rounded">
      New Quiz
      <QuizDetailForm state="create" data={data} />
    </div>
  );
};

export default memo(NewQuiz);
