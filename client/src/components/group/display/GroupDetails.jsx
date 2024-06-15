import React, { useCallback, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import MembersInfo from "./MembersInfo";
import GroupQuizzesInfo from "./GroupQuizzesInfo";
import SearchAddDataBlock from "../features/SearchAddDataBlock";
import Modal from "../../ui/Modal";
import GroupForm from "../features/GroupForm";

const Group = ({ data }) => {
  const {
    _id,
    name,
    description,
    members,
    quizzes,
    instructors,
    createdBy,
    createdAt,
  } = data.group;
  const { role } = useContext(AuthContext);

  const [openedSection, setOpenedSection] = useState("");
  const [groupState, setGroupState] = useState("display");

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
            </div>
            {role === "admin" && (
              <div className="flex">
                <FaEdit
                  className="text-blue-500 hover:text-blue-700 text-xl"
                  onClick={handleQuizForm}
                />
              </div>
            )}
          </div>
        )}
        {groupState === "edit" && role === "admin" && (
          <GroupForm
            onClose={handleDisplay}
            operation="edit"
            formInputs={{ name: name, description: description }}
            groupId={_id}
          />
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
            <SearchAddDataBlock
              handleClose={() => setOpenedSection("")}
              type="users"
              preData={members}
              searchURL={`http://localhost:3000/api/v1/users/search/users?role=user&search=`}
              addURL={`http://localhost:3000/api/v1/group/${_id}/members`}
              removeURL={`http://localhost:3000/api/v1/group/${_id}/members`}
              placeHolder="Search students to add/Remove from group "
            />
          </Modal>
        )}
        {/* Quizzes Section */}
        <GroupQuizzesInfo
          quizzes={quizzes}
          onAdd={handleOpenedSection}
          openedSection={openedSection}
        />
      </div>
      {openedSection === "quizzes" && (
        <Modal
          isOpen={openedSection === "quizzes"}
          onClose={handleOpenedSection}
          isLarge={true}>
          <SearchAddDataBlock
            handleClose={() => setOpenedSection("")}
            type="quizzes"
            preData={quizzes}
            searchURL={`http://localhost:3000/api/v1/quiz/search/quiz?name=`}
            addURL={`http://localhost:3000/api/v1/group/${_id}/quizzes`}
            removeURL={`http://localhost:3000/api/v1/group/${_id}/quizzes`}
            placeHolder="Search Quiz to Add/Remove group"
          />
        </Modal>
      )}
      {/* Teachers Sections */}
      <div className="mx-auto p-3 md:p-6 bg-gray-800 text-white rounded-lg shadow-md mb-8  md:mx-6">
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
            <SearchAddDataBlock
              handleClose={() => setOpenedSection("")}
              type="instructor"
              preData={instructors}
              searchURL={`http://localhost:3000/api/v1/users/search/users?role=instructor&search=`}
              addURL={`http://localhost:3000/api/v1/group/admin/instructor/${_id}`}
              removeURL={`http://localhost:3000/api/v1/group/admin/instructor/${_id}`}
              placeHolder="Search teacher to add/Remove from group "
            />
          </Modal>
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
