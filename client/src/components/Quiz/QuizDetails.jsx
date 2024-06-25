import React, { memo, useCallback, useState } from "react";
import withDataFetching from "../../utils/HigerOrderComponent/withDataFetching";
import { FaEdit } from "react-icons/fa";
import { useParams } from "react-router";
import QuestionCard from "./QuestionCard";
import AddNewQus from "./features/AddNewQus";
import QuizDetailForm from "./features/QuizDetailForm";
import QuizInfo from "./display/QuizInfo";
import Modal from "../ui/Modal";
import QuizStatusChange from "./features/QuizStatusChange";
import QuizFreeOrNot from "./features/QuizFreeOrNot";

const Quiz = ({ data }) => {
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [addNewQusOpen, setIsNewQusOpen] = useState(false);
  const [questionState, setQuestionState] = useState({
    isEditing: false,
    isExpanded: false,
    questionId: null,
  });
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isQuizFreeOrNotOpen, setIsQuizFreeONotOpen] = useState(false);

  const handleToggleAddNewQus = useCallback(() => {
    setIsNewQusOpen(!addNewQusOpen);
  }, [addNewQusOpen]);

  const handleStatusChange = useCallback(() => {
    setIsChangeStatusOpen(!isChangeStatusOpen);
  }, [isChangeStatusOpen]);
  const handleQuizFreeOrNot = useCallback(() => {
    setIsQuizFreeONotOpen(!isQuizFreeOrNotOpen);
  }, [isQuizFreeOrNotOpen]);

  return (
    <div className="container mx-auto md:p-6 p-3 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-lg shadow-md">
      {/* modal for changing status */}
      {isChangeStatusOpen && (
        <Modal
          isOpen={isChangeStatusOpen}
          onClose={() => setIsChangeStatusOpen(false)}>
          <QuizStatusChange
            modalClose={handleStatusChange}
            changeStatusTo={!data.quiz.isPublished}
          />
        </Modal>
      )}
      {/* modal for changing quiz free or not */}
      {isQuizFreeOrNotOpen && (
        <Modal
          isOpen={isQuizFreeOrNotOpen}
          onClose={() => setIsQuizFreeONotOpen(false)}>
          <QuizFreeOrNot
            modalClose={handleQuizFreeOrNot}
            changeTo={!data.quiz.isFree}
          />
        </Modal>
      )}
      {/* quiz details */}
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl lg:text-3xl font-bold">Quiz Details</h2>
          <FaEdit
            className="cursor-pointer text-blue-500 text-2xl hover:text-blue-700"
            onClick={() => setEditingQuiz(!editingQuiz)}
          />
        </div>
        {editingQuiz ? (
          // edit quiz details
          <QuizDetailForm
            data={data}
            setEditingQuiz={setEditingQuiz}
            setIsChangeStatusOpen={setIsChangeStatusOpen}
            state="update"
          />
        ) : (
          // quiz details info
          <QuizInfo
            quiz={data.quiz}
            handleStatusChange={handleStatusChange}
            handleToggleAddNewQus={handleToggleAddNewQus}
            handleQuizFreeOrNot={handleQuizFreeOrNot}
          />
        )}
      </div>
      {/* add new question button */}
      <div className="text-center w-full mt-5 mb-4">
        <button
          onClick={handleToggleAddNewQus}
          className="py-2 px-3  bg-gray-600 hover:bg-gray-500 text-stone-100  rounded transition duration-300 ease-in-out w-fit ">
          {`${addNewQusOpen ? "Close" : "Manage Questions "}`}
        </button>
      </div>

      {/* add a question form */}
      {addNewQusOpen && (
        <AddNewQus
          quiz={data.quiz}
          setIsNewQusOpen={setIsNewQusOpen}
          onCancel={handleToggleAddNewQus}
        />
      )}

      {/* questions card */}
      {data.quiz && data.quiz.questions.length > 0 && !addNewQusOpen && (
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
      {data.quiz && data.quiz.questions.length === 0 && (
        <p className="text-center mt-6 font-bold text-2xl">
          No questions added yet.
        </p>
      )}
    </div>
  );
};

const QuizDetails = () => {
  const { quizId } = useParams();
  console.log(quizId);
  const QuizWithFetching = withDataFetching(Quiz, {
    URL: `http://localhost:3000/api/v1/quiz/${quizId}`,
    queryKey: ["quiz", { id: quizId }],
  });

  return <QuizWithFetching />;
};

export default memo(QuizDetails);
