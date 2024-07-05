import React, { useCallback, useState } from "react";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { GroupsList } from "../../ui/dashBoard/GroupsList";
import Modal from "../../ui/Modal";
import GroupForm from "../../group/features/GroupForm";
import { categories } from "../../../utils/category";

const AdminAllGroupArea = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleOpenModel = useCallback(() => {
    setIsCreateGroupOpen(true);
  }, [isCreateGroupOpen]);

  const handleCloseModel = useCallback(() => {
    setIsCreateGroupOpen(false);
  }, [isCreateGroupOpen]);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [hasNextPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  let URL = `http://localhost:3000/api/v1/group?limit=8&page=${currentPage}`;

  if (categoryName) {
    URL += `&category=${categoryName}`;
  }

  const AdminGroupList = withDataFetching(GroupsList, {
    URL: URL,
    queryKey: ["groups", currentPage, categoryName],
    additionalProps: { hideText: true, setHasNextPage },
  });

  return (
    <div className="container my-4 mx-auto">
      {/* heading Group Manager */}
      {isCreateGroupOpen && (
        <Modal isOpen={isCreateGroupOpen} onClose={handleCloseModel}>
          <GroupForm onClose={handleCloseModel} operation="create" />
        </Modal>
      )}
      {/* button to add group */}
      <div className="flex justify-between items-center  md:mx-auto mx-4 my-6">
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-2xl text-center">
          Group Manager
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs md:text-sm"
          onClick={handleOpenModel}>
          Add Group
        </button>
      </div>
      {/* list of groups */}
      <div className="my-3 md:my-6 flex justify-center items-center">
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="ml-2 p-2 border border-gray-300 rounded text-xs md:text-sm">
          <option value="" disabled>
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
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

export default AdminAllGroupArea;
