import React, { memo, useCallback } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import EditingView from "./EditingView";
import DisplayView from "./DisplayView";

const QuestionCard = ({ question, questionState, setQuestionState }) => {
  const { isEditing, isExpanded, questionId } = questionState;

  const toggleQuestionExpand = useCallback(
    (id) => {
      if (questionId === id) {
        setQuestionState({
          ...questionState,
          isExpanded: !isExpanded,
          isEditing: false,
          questionId: null,
        });
      } else {
        setQuestionState({
          ...questionState,
          isExpanded: true,
          questionId: id,
        });
      }
    },
    [questionState]
  );

  const toggleEditQuestion = useCallback(
    (id) => {
      if (questionId === id) {
        setQuestionState({
          ...questionState,
          isEditing: false,
        });
      } else {
        setQuestionState({
          ...questionState,
          isEditing: true,
        });
      }
    },
    [questionState]
  );

  return (
    <div
      className={`bg-white p-3 md:p-6 md:my-4 my-2 rounded-lg shadow-md text-gray-700 ${
        isExpanded ? "bg-blue-50" : ""
      }`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleQuestionExpand(question.id)}>
        <h3 className="text-md md:text-lg xl:text-xl font-semibold">
          {question.question}
        </h3>
        {isExpanded && questionId === question.id ? (
          <FaChevronUp />
        ) : (
          <FaChevronDown />
        )}
      </div>

      {isExpanded && (
        <div className="md:mt-4 mt-2">
          {isEditing && questionId === question.id && (
            <EditingView
              question={question}
              toggleEditQuestion={toggleEditQuestion}
            />
          )}
          {isExpanded && !isEditing && questionId === question.id && (
            <DisplayView
              question={question}
              id={question.id}
              toggleEditQuestion={toggleEditQuestion}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
