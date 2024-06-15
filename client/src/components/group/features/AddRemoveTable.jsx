import React, { memo, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  authorizedCreator,
  authorizedRemover,
  queryClient,
} from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

const createBody = (type, id) => {
  let body = {};
  if (type === "users") {
    body = { userId: id };
  }
  if (type === "quizzes") {
    body = { quizId: id };
  }
  if (type === "instructor") {
    body = { instructorId: id };
  }
  return body;
};

const AddRemoveTable = ({
  queryData,
  type,
  preData,
  addURL,
  removeURL,
  handleClose,
}) => {
  const { groupId } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  let searchType;
  if (type === "users" || type === "instructor") searchType = "users";
  if (type === "quizzes") searchType = "quizzes";

  const {
    mutate: addItem,
    isLoading: additionLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: authorizedCreator,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

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
      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });
      navigate(`/${role}/groups/${groupId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // check if item already exist yes?=> remove / otherwise => add
  const isItemInPreData = (item) =>
    preData.some((preItem) => preItem._id === item._id);

  const handleAdd = (id) => {
    let body = createBody(type, id);
    addItem({
      URL: addURL,

      body,
    });
  };
  const handleRemove = (id) => {
    let body = createBody(type, id);
    removeItem({
      URL: removeURL,

      body,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg sm:p-4 mt-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Search Results:</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="py-2 px-4 text-left text-gray-600">Name</th>
              {searchType === "users" && (
                <th className="py-2 px-4 text-left text-gray-600">Email</th>
              )}
              <th className="py-2 px-4 text-right text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto" style={{ maxHeight: "200px" }}>
            {queryData[searchType].map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-100 transition">
                <td className="py-2 px-2 md:px-4">{item.name}</td>
                {searchType === "users" && (
                  <td className="py-2 px-2 md:px-4">{item.email}</td>
                )}
                <td className="py-2 px-2 md:px-4 text-right">
                  {isItemInPreData(item) ? (
                    <button
                      className="bg-red-500 w-[80px] text-white px-2 md:px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
                      onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 w-[80px] text-white px-2 md:px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
                      onClick={() => handleAdd(item.id)}>
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(AddRemoveTable);
