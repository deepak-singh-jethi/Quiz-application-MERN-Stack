import React, { useCallback, useState, memo, useEffect } from "react";
import { FaUser, FaUserCircle, FaSearch, FaTimes } from "react-icons/fa";

// Fallback component when no members are found
const NoMembersFallback = () => (
  <div className="flex justify-center rounded items-center h-[80px] bg-gray-400">
    <p className="text-lg text-gray-500">No members found.</p>
  </div>
);

const MembersInfo = ({ members, onAdd, openedSection, sectionName, role }) => {
  const [memberInfo, setMemberInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMemberInfo(members);
  }, [members]);

  // for opening add new students area
  const handleAdd = () => {
    onAdd(sectionName);
  };

  // for handling the search of students
  const handleSearch = useCallback(
    (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(query)
      );
      setMemberInfo(filteredMembers);
    },
    [searchQuery]
  );

  const clearSearch = () => {
    setSearchQuery("");
    setMemberInfo(members);
  };

  return (
    <div className="m-3 overflow-x-hidden pb-4 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="flex justify-start items-center gap-3 mb-5">
        <h2 className="text-lg md:text-xl font-semibold  flex items-center">
          <FaUser className="mr-2" /> {sectionName} ({memberInfo.length})
        </h2>

        {role === "admin" && (
          <button
            className={`ml-4 ${
              openedSection !== sectionName ? "bg-blue-500" : "bg-red-600"
            } bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg ${
              openedSection !== sectionName
                ? "hover:bg-blue-600"
                : "hover:bg-red-500"
            } transition duration-100`}
            onClick={handleAdd}>
            Manage {sectionName}
          </button>
        )}
      </div>

      <div className="flex items-center mb-4 md:max-w-md mt-2">
        <div className="relative flex-grow">
          <FaSearch className="absolute top-3 left-3 text-gray-800" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={`Search ${sectionName}`}
            className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          {searchQuery && (
            <FaTimes
              className="absolute top-3 right-3 text-gray-800 cursor-pointer"
              onClick={clearSearch}
            />
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {memberInfo.length > 0 ? (
          <div className="grid grid-rows-2  grid-flow-col gap-4 items-center justify-start mt-3">
            {memberInfo.map((member) => (
              <div
                key={member._id}
                className="p-4 bg-gray-700 rounded-lg shadow-sm flex items-center h-[80px] w-[300px] md:w-[350px] lg:w-[400px] transition-transform transform hover:bg-gray-600">
                <FaUserCircle className="text-3xl mr-4 text-blue-500" />
                <div>
                  <p className="text-lg font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">ID: {member.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoMembersFallback />
        )}
      </div>
    </div>
  );
};

export default MembersInfo;
