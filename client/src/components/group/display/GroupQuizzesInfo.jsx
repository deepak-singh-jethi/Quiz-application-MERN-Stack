import React, { memo, useEffect, useState } from "react";
import { FaBook, FaSearch, FaTimes } from "react-icons/fa";

// Fallback component when no quizzes are found
const NoQuizzesFallback = () => (
  <div className="flex justify-center rounded items-center h-[80px] bg-gray-400">
    <p className="text-lg text-gray-500">No Quizzes found.</p>
  </div>
);

const GroupQuizzesInfo = ({ quizzes, onAdd, openedSection }) => {
  const [quizzesInfo, setQuizzesInfo] = useState(quizzes);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(quizzes);

  useEffect(() => {
    setQuizzesInfo(quizzes);
  }, [quizzes]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter quizzes based on search query
    const filteredQuizzes = quizzes.filter((quiz) =>
      quiz.name.toLowerCase().includes(query)
    );
    setQuizzesInfo(filteredQuizzes);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setQuizzesInfo(quizzes);
  };
  const handleAdd = () => {
    onAdd("quizzes");
  };

  return (
    <div className="md:m-3 m-1 overflow-x-hidden pb-4 px-1 sm:px-8 md:px-16 lg:px-24">
      <div className="flex justify-start items-center gap-3 mb-5">
        <h2 className="text-sm md:text-lg font-semibold mb-2 flex items-center">
          <FaBook className="mr-2" /> Quizzes ({quizzesInfo.length})
        </h2>
        <button
          className={`ml-4 ${
            openedSection !== "quizzes" ? "bg-blue-500" : "bg-red-600"
          } bg-blue-500 text-white font-semibold md:py-2 p-1 md:px-3 px-1 rounded-lg ${
            openedSection !== "quizzes"
              ? "hover:bg-blue-600"
              : "hover:bg-red-500"
          } transition duration-100`}
          onClick={handleAdd}>
          Manage Quizzes
        </button>
      </div>
      {/* search bar */}
      <div className="flex items-center mb-4 md:max-w-md mt-2">
        <div className="relative flex-grow">
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search quizzes"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          {searchQuery && (
            <FaTimes
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={clearSearch}
            />
          )}
        </div>
      </div>
      {/* quizzes info */}
      <div className="overflow-x-auto pb-8">
        {quizzesInfo.length > 0 ? (
          <div
            className={`grid ${
              quizzesInfo.length > 3 ? " grid-rows-2 " : " grid-rows-1 "
            }  gap-4 items-center justify-start mt-3 grid-flow-col`}>
            {quizzesInfo.map((quiz) => (
              <div
                key={quiz.quiz.id}
                className="bg-gray-700 rounded-lg shadow-sm flex items-center h-[60px] w-[250px] md:w-[350px] lg:w-[400px] md:p-4 p-2 transition-transform transform hover:bg-gray-600">
                <FaBook className="text-lg md:text-xl lg:text-2xl mr-4 text-yellow-500" />
                <div>
                  <p className="text-xs md:text-md sm:text-[15px] font-medium mb-1">
                    {quiz.quiz.name}
                  </p>
                  <p className="text-xs sm:text-[15px] text-gray-400">
                    Scheduled: {new Date(quiz.scheduledFor).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoQuizzesFallback />
        )}
      </div>
    </div>
  );
};

export default memo(GroupQuizzesInfo);
