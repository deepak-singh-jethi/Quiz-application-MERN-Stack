import React, { useState } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { GroupsList } from "../../ui/dashBoard/GroupsList";

const InstructorAllGroupArea = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const AdminGroupList = withDataFetching(GroupsList, {
    URL: `http://localhost:3000/api/v1/group/instructor/all?page=${currentPage}&limit=8`,
    queryKey: ["AllInstructorGroups", currentPage],
    additionalProps: { hideText: true, setHasNextPage },
  });

  return (
    <div className="my-4">
      {/* heading Group Manager */}
      <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-2xl text-center pb-4">
        Group Manager
      </h1>
      <AdminGroupList />
      {/* button next and previous */}
      <div className="flex justify-center items-center mt-4">
        {currentPage !== 1 && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}>
            Previous
          </button>
        )}
        {hasNextPage && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={handleNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorAllGroupArea;
