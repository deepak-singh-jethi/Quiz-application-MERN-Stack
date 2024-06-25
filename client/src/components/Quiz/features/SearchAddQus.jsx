import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../ui/Loading";
import ErrorBlock from "../../ui/ErrorBlock";
import {
  authorizedFetcher,
  authorizedUpdater,
  authorizedRemover,
  queryClient,
} from "../../../utils/http";
import { useParams } from "react-router";

const SearchAddQus = ({ quizTopics, quizQuestions: preData }) => {
  const { quizId } = useParams();
  console.log(quizId);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isTopicSelected, setIsTopicSelected] = useState(false);

  const {
    data,
    isLoading: questionsLoading,
    isError: questionsError,
    error: questionsErrorDetails,
  } = useQuery({
    queryKey: ["questions-searched", selectedTopic, pageNumber],
    queryFn: ({ signal }) =>
      authorizedFetcher({
        URL: `http://localhost:3000/api/v1/questions/search/All?topic=${selectedTopic}&limit=10&page=${pageNumber}`,
        signal,
      }),
    enabled: isTopicSelected,
    keepPreviousData: true,
    onSuccess: () => {},
  });
  const {
    mutate: addQus,
    isLoading: isAdding,
    isError: isErrorAdding,
    error: isAddingError,
  } = useMutation({
    mutationFn: authorizedUpdater,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "questions-searched",
        selectedTopic,
        "quiz",
        { id: quizId },
      ]);
    },
  });

  const {
    mutate: removeQus,
    isLoading: isRemoving,
    isError: isErrorRemoving,
    error: isRemovingError,
  } = useMutation({
    mutationFn: authorizedRemover,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "questions-searched",
        selectedTopic,
        "quiz",
        { id: quizId },
      ]);
    },
  });

  const handleQuizQuestions = (operation, questionId) => {
    console.log(questionId);
    if (operation === "add") {
      addQus({
        URL: `http://localhost:3000/api/v1/questions/${quizId}/${questionId}`,
      });
    }
    if (operation === "remove") {
      removeQus({
        URL: `http://localhost:3000/api/v1/questions/${quizId}/${questionId}`,
        data: { questions: [questionId] },
      });
    }
  };
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setIsTopicSelected(true);
  };

  const handlePageNumber = (operation) => {
    if (operation === "add") {
      setPageNumber((prev) => prev + 1);
    } else {
      setPageNumber((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-0 md:mx-auto p-1 md:p-6 lg:p-8 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-lg shadow-md mt-6">
      {/* quiz topic buttons */}
      <h5 className="text-center py-3">Select a Quiz Topics</h5>
      <div className="flex flex-wrap gap-3 justify-center items-center mb-5">
        {quizTopics.map((topic) => (
          <div
            key={topic}
            className="bg-gray-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 cursor-pointer text-xs"
            onClick={() => handleSelectTopic(topic)}>
            {topic}
          </div>
        ))}
      </div>

      {questionsLoading && <Loading />}
      {questionsError && <ErrorBlock error={questionsErrorDetails.message} />}

      {/* questions table head */}

      {data && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md md:p-4">
          <table className="min-w-full border border-gray-300 text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-2 md:px-4 border-b border-gray-300 text-sm">
                  Question
                </th>
                <th className="py-2 px-2 md:px-4 border-b border-gray-300 text-sm">
                  Correct Answer
                </th>
                <th className="py-2 px-2 md:px-4 border-b border-gray-300 text-sm">
                  Action
                </th>
              </tr>
            </thead>
            {/* questions table body */}
            <tbody>
              {data.questions.map((question) => (
                <tr key={question._id} className="hover:bg-gray-100">
                  <td className="py-2 px-2 md:px-4 border-b border-gray-300 text-xs">
                    {question.question}
                  </td>
                  <td className="py-2 px-2 md:px-4 border-b border-gray-300 text-xs">
                    {question.correctAnswer}
                  </td>
                  {/* add to quiz button if already added show added */}
                  <td className="py-2 px-2 md:px-4 border-b border-gray-300 text-xs">
                    {preData.some((q) => q._id === question._id) ? (
                      <button
                        onClick={() =>
                          handleQuizQuestions("remove", question._id)
                        }
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition duration-200 text-xs">
                        remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuizQuestions("add", question._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200 text-xs">
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            {pageNumber > 1 && (
              <button
                onClick={() => handlePageNumber("subtract")}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-200 mr-2 text-xs">
                Prev
              </button>
            )}
            <p className="text-sm text-gray-700">{pageNumber}</p>
            {data.hasNextPage && (
              <button
                onClick={() => handlePageNumber("add")}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-200 ml-2 text-xs">
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAddQus;
