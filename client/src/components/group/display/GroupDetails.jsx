import React, {
  useCallback,
  useState,
  useContext,
  lazy,
  Suspense,
} from "react";

import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const SearchAddDataBlock = lazy(() => import("../features/SearchAddDataBlock"));
const SearchAddUpdateQuizzes = lazy(() =>
  import("../features/SearchAddUpdateQuizzes")
);
const GroupForm = lazy(() => import("../features/GroupForm"));
import MembersInfo from "./MembersInfo";
import GroupQuizzesInfo from "./GroupQuizzesInfo";
import Modal from "../../ui/Modal";
import Loading from "../../ui/Loading";
import { authorizedRemover, queryClient } from "../../../utils/http";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { useMutation } from "@tanstack/react-query";

const Group = ({ data }) => {
  const {
    _id,
    name,
    description,
    category,
    members,
    quizzes,
    instructors,
    isDeleted,
  } = data.group;
  const { role } = useContext(AuthContext);
  const [openedSection, setOpenedSection] = useState("");
  const [groupState, setGroupState] = useState("display");

  const { mutate } = useMutation({
    mutationFn: authorizedRemover,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      setGroupState("display");
    },
  });

  const handleOpenedSection = (section) => {
    if (section === openedSection) {
      setOpenedSection("");
    } else setOpenedSection(section);
  };

  const handleQuizForm = useCallback(() => {
    setGroupState("edit");
  }, []);
  const handleDisplay = useCallback(() => {
    setGroupState("display");
  }, []);
  const handleDeleteGroup = () => {
    mutate({
      URL: `http://localhost:3000/api/v1/group/${_id}`,
    });
  };
  console.log(isDeleted);

  return (
    <>
      <div className="container mx-auto p-2  md:p-3  bg-white text-gray-700 rounded-lg shadow-md text-center ml-0 md:ml-10">
        {groupState === "display" && (
          <div className=" flex items-center justify-center gap-6">
            <div>
              <h1 className="text-lg md:text-xl lg:text-3xl font-semibold mb-1">
                {name}
              </h1>
              <p className="text-sm md:text-lg">{description}</p>
              <p className="text-sm md:text-lg">{category}</p>
            </div>
            {role === "admin" && (
              <>
                <div className="flex">
                  <FaEdit
                    className="text-blue-500 hover:text-blue-700 text-xl"
                    onClick={handleQuizForm}
                  />
                </div>
                <div>
                  {/* delete/ make active a group */}
                  <button
                    onClick={() => setGroupState("delete")}
                    className={`rounded-md px-2 py-1 text-white  hover:ring-1 ${
                      isDeleted
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-400 hover:bg-red-500"
                    }`}>
                    {isDeleted ? "Make active" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {groupState === "edit" && role === "admin" && (
          <Suspense fallback={<Loading />}>
            <GroupForm
              onClose={handleDisplay}
              operation="edit"
              formInputs={{ name: name, description: description }}
              groupId={_id}
            />
          </Suspense>
        )}
        {groupState === "delete" && role === "admin" && (
          <Modal
            isOpen={groupState === "delete"}
            onClose={() => setGroupState("display")}>
            <div className="p-6 bg-white rounded-lg">
              <p className="mb-4 text-gray-600">
                Are you sure you want to {isDeleted ? "Make active" : "Delete"}{" "}
                this group "{name}"?
              </p>
              <div className="flex justify-between">
                <button
                  className={`rounded-md px-2 py-1 text-white  hover:ring-1 ${
                    isDeleted
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-400 hover:bg-red-500"
                  }`}
                  onClick={handleDeleteGroup}>
                  {isDeleted ? "Make active" : "Delete"}
                </button>
                <button
                  className="bg-green-500 rounded-md px-2 py-1 text-white hover:bg-green-500 hover:ring-1"
                  onClick={() => setGroupState("display")}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
      <div className="mx-auto p-3 md:p-6 bg-gray-800 text-white rounded-lg shadow-md mb-8  md:mx-6">
        {/* Members Section */}
        <MembersInfo
          members={members}
          onAdd={handleOpenedSection}
          openedSection={openedSection}
          sectionName="member"
          role={role}
        />

        {openedSection === "member" && (
          <Modal
            isOpen={openedSection === "member"}
            onClose={handleOpenedSection}
            isLarge={true}>
            {/* SearchAddDataBlock for students or users */}
            <Suspense fallback={<Loading />}>
              <SearchAddDataBlock
                handleClose={() => setOpenedSection("")}
                type="users"
                preData={members}
                searchURL={`http://localhost:3000/api/v1/users/search/users?role=user&search=`}
                addURL={`http://localhost:3000/api/v1/group/${_id}/members`}
                removeURL={`http://localhost:3000/api/v1/group/${_id}/members`}
                placeHolder="Search students to add/Remove from group "
              />
            </Suspense>
          </Modal>
        )}

        {/* Teachers Sections */}

        <MembersInfo
          members={instructors}
          onAdd={handleOpenedSection}
          openedSection={openedSection}
          sectionName="instructor"
          role={role}
        />

        {openedSection === "instructor" && role === "admin" && (
          <Modal
            isOpen={openedSection === "instructor"}
            onClose={handleOpenedSection}
            isLarge={true}>
            {/* SearchAddDataBlock for instructors */}
            <Suspense fallback={<Loading />}>
              <SearchAddDataBlock
                handleClose={() => setOpenedSection("")}
                type="instructor"
                preData={instructors}
                searchURL={`http://localhost:3000/api/v1/users/search/users?role=instructor&search=`}
                addURL={`http://localhost:3000/api/v1/group/admin/instructor/${_id}`}
                removeURL={`http://localhost:3000/api/v1/group/admin/instructor/${_id}`}
                placeHolder="Search teacher to add/Remove from group "
              />
            </Suspense>
          </Modal>
        )}

        {/* Quizzes Section */}
        <GroupQuizzesInfo
          quizzes={quizzes}
          onAdd={handleOpenedSection}
          openedSection={openedSection}
        />

        {openedSection === "quizzes" && (
          <Suspense fallback={<Loading />}>
            <SearchAddUpdateQuizzes
              handleClose={() => setOpenedSection("")}
              preData={quizzes}
            />
          </Suspense>
        )}
      </div>
    </>
  );
};

const GroupDetails = () => {
  const { groupId } = useParams();
  const GroupWithData = withDataFetching(Group, {
    URL: `http://localhost:3000/api/v1/group/${groupId}`,
    queryKey: ["group", groupId],
  });
  return <GroupWithData />;
};

export default GroupDetails;
