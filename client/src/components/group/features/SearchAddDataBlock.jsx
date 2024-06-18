import React, { useState, useCallback, useContext, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { authorizedFetcher, queryClient } from "../../../utils/http";
import { AuthContext } from "../../../context/AuthContext";
import AddRemoveTable from "./AddRemoveTable";

const SearchAddDataBlock = ({
  handleClose,
  type,
  preData,
  placeHolder,
  searchURL,
  addURL,
  removeURL,
}) => {
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const {
    data: queryData,
    isLoading: queryLoading,
    isError: isQueryError,
    error: queryError,
  } = useQuery({
    queryKey: ["search", { type }],
    queryFn: ({ signal }) =>
      authorizedFetcher({ signal, URL: `${searchURL + searchQuery}`, token }),
    enabled: searchQuery.trim() !== "" && isSearchEnabled,
  });

  useEffect(() => {
    if (queryData) {
      setIsSearchEnabled(false);
      queryClient.invalidateQueries({ queryKey: ["search", { type }] });
    }
  }, [queryData]);

  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setIsSearchEnabled(true);
      }
    },
    [searchQuery]
  );
  const handleSearch2 = useCallback(() => {
    setIsSearchEnabled(true);
  }, [searchQuery]);

  return (
    <div className="bg-white w-full max-w-3xl px-1 py-4 md:p-4 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4 mt-3">
        <div className="relative w-full ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder={placeHolder}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <FaSearch
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500 "
            onClick={handleSearch2}
          />
        </div>
        <FaTimes
          className="ml-4 mr-3 text-gray-500 cursor-pointer text-xl hover:text-red-500"
          onClick={handleClose}
        />
      </div>

      <div className="mt-6">
        {queryLoading && <p className="text-gray-600">Loading...</p>}
        {isQueryError && (
          <p className="text-red-500">Error: {queryError.message}</p>
        )}
        {queryData && type !== "quizzes" && (
          <AddRemoveTable
            queryData={queryData}
            type={type}
            preData={preData}
            addURL={addURL}
            removeURL={removeURL}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default SearchAddDataBlock;
