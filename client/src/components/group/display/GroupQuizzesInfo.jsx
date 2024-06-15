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
    <div className="mt-6 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="flex justify-start items-center gap-3 mb-5">
        <h2 className="text-lg md:text-xl font-semibold mb-2 flex items-center">
          <FaBook className="mr-2" /> Quizzes ({quizzesInfo.length})
        </h2>
        <button
          className={`ml-4 ${
            openedSection !== "quizzes" ? "bg-blue-500" : "bg-red-600"
          } bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg ${
            openedSection !== "quizzes"
              ? "hover:bg-blue-600"
              : "hover:bg-red-500"
          } transition duration-100`}
          onClick={handleAdd}>
          Manage Quizzes
        </button>
      </div>

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
      <div className="overflow-x-auto mb-6">
        {quizzesInfo.length > 0 ? (
          <div className="grid grid-rows-2  grid-flow-col gap-4 items-center justify-start mt-3">
            {quizzesInfo.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-gray-700 rounded-lg shadow-sm flex items-center h-[84px] w-[300px] md:w-[350px] lg:w-[400px] p-4 transition-transform transform hover:bg-gray-600">
                <FaBook className="text-4xl mr-4 text-yellow-500" />
                <div>
                  <p className="text-xs sm:text-[15px] font-medium mb-1">
                    {quiz.name}
                  </p>
                  <p className="text-xs sm:text-[15px] text-gray-400">
                    ID: {quiz.id}
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
