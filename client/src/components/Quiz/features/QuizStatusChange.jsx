import React, { memo, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, authorizedUpdater } from "../../../utils/http";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../../context/AuthContext";

const QuizStatusChange = ({ modalClose, changeStatusTo }) => {
  const { quizId } = useParams();
  const { token } = useContext(AuthContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: authorizedUpdater,
    onSuccess: () => {
      queryClient.invalidateQueries([
        ["AllLiveQuizzes"],
        ["AllUpcomingQuizzes"],
        ["AllResultedQuizzes"],
        ["6-live-quizzes"],
        ["5-upcoming-quizzes"],
        ["quiz", { id: quizId }],
      ]);

      modalClose();
    },
  });

  const handleUpdate = () => {
    mutate({
      URL: `http://localhost:3000/api/v1/quiz/${quizId}`,
      body: { isPublished: changeStatusTo },
      token: token,
    });
  };

  let content = (
    <>
      <button
        className={`px-4 py-2 rounded ${
          changeStatusTo
            ? "bg-[#23C55E] hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white`}
        onClick={handleUpdate}>
        {`${changeStatusTo ? "Make Public" : "Hide Quiz"}`}
      </button>
      <button
        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
        onClick={modalClose}>
        Cancel
      </button>
    </>
  );
  if (isPending) {
    content = (
      <div className="text-center w-full">
        <button className="px-4 py-2 rounded bg-gray-300">
          Changing Status
        </button>
      </div>
    );
  }
  if (isError) {
    content = <p>{error.message}</p>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Change Quiz Status</h3>
      <p className="mb-6">{`Are you sure you want to ${
        changeStatusTo ? "hide" : "make public"
      } this quiz?`}</p>
      <div className="flex justify-end space-x-4">{content}</div>
    </div>
  );
};

export default memo(QuizStatusChange);
