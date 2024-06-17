import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  authorizedFetcher,
  authorizedCreator,
  authorizedRemover,
  authorizedUpdater,
  queryClient,
} from "../../../utils/http";

const SearchAddUpdateQuizzes = ({ handleClose, preData }) => {
  const { groupId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [schedule, setSchedule] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: queryData,
    isLoading: queryLoading,
    isError: isQueryError,
    error: queryError,
  } = useQuery({
    queryKey: ["search"],
    queryFn: ({ signal }) =>
      authorizedFetcher({
        signal,
        URL: `http://localhost:3000/api/v1/quiz/search/quiz?limit=4&name=${searchQuery}`,
      }),
    enabled: searchQuery.trim() !== "" && isSearchEnabled,
    onSuccess: (data) => {
      setIsSearchEnabled(false);
    },
  });

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: authorizedRemover,
    onSuccess: () => {
      queryClient.invalidateQueries(["group", groupId, "search"]);
    },
  });

  const { mutate: addQuiz } = useMutation({
    mutationFn: authorizedCreator,
    onSuccess: () => {
      queryClient.invalidateQueries(["group", groupId, "search"]);
    },
  });

  const { mutate: updateQuiz } = useMutation({
    mutationFn: authorizedUpdater,
    onSuccess: () => {
      queryClient.invalidateQueries(["group", groupId, "search"]);
    },
  });

  const handleSearchQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["search"] });
    setIsSearchEnabled(true);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const handleAddOrUpdateClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = () => {
    if (preData.some((item) => item.quiz._id === selectedQuiz._id)) {
      updateQuiz({
        URL: `http://localhost:3000/api/v1/group/${groupId}/quizzes`,
        body: { quizId: selectedQuiz._id, scheduledFor: schedule },
      });
    } else {
      addQuiz({
        URL: `http://localhost:3000/api/v1/group/${groupId}/quizzes`,
        body: { quizId: selectedQuiz._id, scheduledFor: schedule },
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (quizId) => {
    deleteQuiz({
      URL: `http://localhost:3000/api/v1/group/${groupId}/quizzes`,
      body: { quizId },
    });
  };

  return (
    <div className="p-2 md:p-6 bg-white rounded-lg shadow-md text-gray-800 max-w-4xl md:mx-auto">
      <nav className="mb-6">
        <input
          type="text"
          placeholder="Search for quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSearchQuery}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200">
            Search
          </button>
          <button
            onClick={handleClose}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200">
            Close
          </button>
        </div>
      </nav>
      {queryLoading && <p className="text-gray-600">Loading...</p>}
      {isQueryError && (
        <p className="text-red-600">Error: {queryError.message}</p>
      )}
      {queryData && (
        <div>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 md:px-4 border-b text-start">Quiz Name</th>
                <th className="py-2 md:px-4 border-b flex justify-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {queryData.quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td className="py-2 md:px-4 border-b">{quiz.name}</td>
                  <td className="py-2 md:px-4 border-b flex justify-end">
                    {preData.some((item) => item.quiz._id === quiz._id) ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddOrUpdateClick(quiz)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200">
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200">
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddOrUpdateClick(quiz)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200">
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md mx-auto p-6">
            <h2 className="text-lg font-semibold">Set Schedule</h2>
            <input
              type="datetime-local"
              value={schedule}
              onChange={handleScheduleChange}
              className="mt-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 mr-2 transition duration-200">
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAddUpdateQuizzes;
