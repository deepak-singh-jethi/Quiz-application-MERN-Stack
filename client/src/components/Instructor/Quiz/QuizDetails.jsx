import React, { useCallback, useState } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { FaEdit } from "react-icons/fa";
import { useParams } from "react-router";
import QuestionCard from "./QuestionCard";
import AddNewQus from "./AddNewQus";
import Button1 from "../../ui/Button1";
import QuizDetailEdit from "./QuizDetailEdit";

const Quiz = ({ data }) => {
  const quiz = data.quiz;
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [addNewQusOpen, setIsNewQusOpen] = useState(false);

  const [questionState, setQuestionState] = useState({
    isEditing: false,
    isExpanded: false,
    questionId: null,
  });

  const handleToggleAddNewQus = useCallback(() => {
    setIsNewQusOpen(!addNewQusOpen);
  }, [addNewQusOpen]);

  return (
    <div className="container mx-auto md:p-6 p-3 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-lg shadow-md">
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl lg:text-3xl font-bold">Quiz Details</h2>
          <FaEdit
            className="cursor-pointer text-blue-500"
            onClick={() => setEditingQuiz(!editingQuiz)}
          />
        </div>
        {editingQuiz ? (
          <QuizDetailEdit data={data} setEditingQuiz={setEditingQuiz} />
        ) : (
          <div className="mt-4 space-y-2">
            <p>
              <strong>Name:</strong> {data.quiz.name}
            </p>
            <p>
              <strong>Duration:</strong> {data.quiz.duration} minutes
            </p>
            <p>
              <strong>Per Question Marks:</strong> {data.quiz.perQusMarks}
            </p>
            <p>
              <strong>Topics:</strong> {data.quiz.topics.join(", ")}
            </p>
            <p>
              <strong>Total Questions:</strong> {data.quiz.questions.length}
            </p>
            {/* add a question button */}
            <div className="w-full text-center">
              <Button1 onClick={handleToggleAddNewQus}>Add Question</Button1>
            </div>
          </div>
        )}
      </div>
      {/* add a question form */}
      {addNewQusOpen && (
        <AddNewQus
          quiz={quiz}
          setIsNewQusOpen={setIsNewQusOpen}
          onCancel={handleToggleAddNewQus}
        />
      )}

      {/* questions card */}
      {quiz && quiz.questions.length > 0 && (
        <div className="mt-6">
          {data.quiz.questions.map((question, qIndex) => (
            <QuestionCard
              key={qIndex}
              question={question}
              questionState={questionState}
              setQuestionState={setQuestionState}
            />
          ))}
        </div>
      )}
      {quiz && quiz.questions.length === 0 && (
        <p className="text-center mt-6 font-bold text-2xl">
          No questions added yet.
        </p>
      )}
    </div>
  );
};

const QuizDetails = () => {
  const { quizId } = useParams();
  const QuizWithFetching = withDataFetching(Quiz, {
    URL: `http://localhost:3000/api/v1/quiz/${quizId}`,
    queryKey: ["quiz", { id: quizId }],
  });

  return <QuizWithFetching />;
};

export default QuizDetails;
