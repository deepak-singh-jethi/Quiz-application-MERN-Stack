import React, { memo, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  authorizedCreator,
  authorizedRemover,
  queryClient,
} from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

const AddRemoveQuizzes = ({ queryData, preData, addURL, removeURL }) => {
  const { groupId } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const {
    mutate: addItem,
    isLoading: additionLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: authorizedCreator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      navigate(`/${role}/groups/${groupId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: removeItem,
    isLoading: removalLoading,
    isError: isRemoveError,
    error: removeError,
  } = useMutation({
    mutationFn: authorizedRemover,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      navigate(`/${role}/groups/${groupId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const isItemInPreData = (item) =>
    preData.some((preItem) => preItem.quiz._id === item._id);

  const handleAdd = (quizId) => {
    const scheduledFor = schedule[quizId];
    if (!scheduledFor) {
      alert("Please select a schedule date and time.");
      return;
    }

    addItem({
      URL: addURL,
      body: {
        quizId,
        scheduledFor,
      },
    });
  };

  const handleRemove = (quizId) => {
    removeItem({
      URL: removeURL,
      body: { quizId },
    });
  };

  const openScheduleModal = (quiz) => {
    setSelectedQuiz(quiz);
    setSchedule({ ...schedule, [quiz._id]: "" });
  };

  const handleScheduleChange = (quizId, value) => {
    setSchedule({ ...schedule, [quizId]: value });
  };

  const handleSubmitSchedule = () => {
    if (schedule[selectedQuiz._id]) {
      handleAdd(selectedQuiz._id);
      setSelectedQuiz(null);
    } else {
      alert("Please select a schedule date and time.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg sm:p-4 mt-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Search Results:</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="py-2 px-4 text-left text-gray-600">Name</th>
              <th className="py-2 px-4 text-right text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto" style={{ maxHeight: "200px" }}>
            {queryData.quizzes.map((quiz) => (
              <tr
                key={quiz._id}
                className="border-b hover:bg-gray-100 transition">
                <td className="py-2 px-2 md:px-4">{quiz.name}</td>
                <td className="py-2 px-2 md:px-4 flex justify-end">
                  {isItemInPreData(quiz) ? (
                    <button
                      className="bg-red-500 w-[30px] h-[30px] flex justify-center items-center text-white px-2 md:px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
                      onClick={() => handleRemove(quiz._id)}>
                      -
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 w-[30px] h-[30px] flex justify-center items-center text-white px-2 md:px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
                      onClick={() => openScheduleModal(quiz)}>
                      +
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuiz && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-[90%] md:w-[50%] lg:w-[30%]">
            <h3 className="text-lg font-semibold mb-2">
              Schedule Quiz: {selectedQuiz.name}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">
                Select Date and Time:
              </label>
              <input
                type="datetime-local"
                value={schedule[selectedQuiz._id] || ""}
                onChange={(e) =>
                  handleScheduleChange(selectedQuiz._id, e.target.value)
                }
                className="block w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                onClick={handleSubmitSchedule}>
                Submit
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setSelectedQuiz(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AddRemoveQuizzes);
