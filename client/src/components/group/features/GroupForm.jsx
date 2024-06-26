import React, { useState } from "react";
import { authorizedCreator, authorizedUpdater } from "../../../utils/http";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";
import Loading from "../../ui/Loading";
import ErrorBlock from "../../ui/ErrorBlock";
import { categories } from "../../../utils/category";
const inputStyle =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

const GroupForm = ({
  onClose,
  operation,
  groupId,
  formInputs = {
    name: "",
    description: "",
    category: "ukpsc",
  },
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ...formInputs,
  });
  const [formError, setFormError] = useState("");

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: authorizedCreator,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setFormData({
        name: "",
        description: "",
        category: "",
      });
      navigate(`/admin/groups/${data.group.id}`);
      onClose();
    },
  });
  const { mutate: editGroup } = useMutation({
    mutationFn: authorizedUpdater,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });
      setFormData({
        name: "",
        description: "",
        category: "",
      });
      navigate(`/admin/groups/${data.group.id}`);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name === "" || formData.description === "") {
      setFormError("Please Fill all the fields");
      return;
    }
    if (operation === "edit") {
      editGroup({
        URL: `http://localhost:3000/api/v1/group/${groupId}`,
        body: formData,
      });
      return;
    }
    mutate({
      URL: "http://localhost:3000/api/v1/group",
      body: formData,
    });
    setFormError("");
  };

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    <ErrorBlock message={error.message} />;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        {operation.toUpperCase()} GROUP
      </h1>
      {!data && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputStyle}
          />
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            className={inputStyle}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }>
            {categories.map((category) => (
              <option value={categories}>{category.toUpperCase()}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={inputStyle}
          />
          <div className="flex gap-3">
            <button className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300">
              {operation === "edit" ? "Update" : "Create"}
            </button>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300">
              Close
            </button>
          </div>

          <h4 className="text-red-600 mt-2 text-center">{formError}</h4>
          <h4 className="text-green-600 mt-2 text-center">
            {error?.message && error.message}
          </h4>
        </form>
      )}
      {data && operation === "create" && (
        <div className="text-green-600 mt-2 text-center">
          {data.group.name.toUpperCase()} CREATED
        </div>
      )}
    </div>
  );
};

export default GroupForm;
