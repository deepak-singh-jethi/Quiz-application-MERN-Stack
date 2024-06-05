import { useParams } from "react-router-dom";
import React, { memo, useCallback, useContext, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authorizedRemover, queryClient } from "../../../utils/http";
import { AuthContext } from "../../../context/AuthContext.jsx";
import Modal from "../../ui/Modal.jsx";

const DisplayView = ({ question, index, toggleEditQuestion }) => {
  const navigate = useNavigate();
  const { token, role } = useContext(AuthContext);
  const { quizId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate } = useMutation({
    mutationFn: authorizedRemover,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", { id: quizId }],
      });
      navigate(`/${role}/quizzes/${quizId}`);
    },
  });

  const handleQuestionDelete = useCallback((id) => {
    setIsDeleting(true);
  }, []);

  return (
    <div>
      {isDeleting && (
        <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl  font-semibold text-gray-800 mb-4">
              Are you sure to delete this question?
            </h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-green-400 text-gray-800 rounded-md hover:bg-green-500 transition duration-200"
                onClick={() => setIsDeleting(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => {
                  mutate({
                    URL: `http://localhost:3000/api/v1/quiz/questions/${question.id}`,
                    token: token,
                  });
                  setIsDeleting(false);
                }}>
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      <ul className="list-disc pl-5">
        {question.options.map((option, oIndex) => (
          <li key={oIndex}>{option}</li>
        ))}
      </ul>
      <p className="mt-2">
        <strong className="text-green-500">Correct Answer:</strong>{" "}
        {question.correctAnswer}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <FaEdit
          className="cursor-pointer text-blue-500 text-2xl mr-5"
          onClick={() => toggleEditQuestion(index)}
        />
        <FaTrash
          className="cursor-pointer text-red-500 text-2xl"
          onClick={() => handleQuestionDelete(question.id)}
        />
      </div>
    </div>
  );
};

export default memo(DisplayView);
