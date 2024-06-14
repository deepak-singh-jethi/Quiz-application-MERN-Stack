import React, { useState } from "react";
import { useParams } from "react-router-dom";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import MembersInfo from "./MembersInfo";
import GroupQuizzesInfo from "./GroupQuizzesInfo";
import SearchAddDataBlock from "../features/SearchAddDataBlock";
import Modal from "../../ui/Modal";

const Group = ({ data }) => {
  const { _id, name, description, members, quizzes, createdBy, createdAt } =
    data.group;

  const [openedSection, setOpenedSection] = useState("");

  const handleOpenedSection = (section) => {
    if (section === openedSection) {
      setOpenedSection("");
    } else setOpenedSection(section);
  };

  return (
    <>
      <div className="container mx-auto p-2  md:p-3  bg-white text-gray-700 rounded-lg shadow-md text-center ml-0 md:ml-10">
        <h1 className="text-3xl font-semibold mb-1">{name}</h1>
        <p className="text-lg">{description}</p>
      </div>
      <div className="mx-auto p-3 md:p-6 bg-gray-800 text-white rounded-lg shadow-md mb-8  md:mx-6">
        {/* Members Section */}
        <MembersInfo
          members={members}
          onAdd={handleOpenedSection}
          openedSection={openedSection}
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
              placeHolder="Search and add members"
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
            placeHolder="Search and add quizzes"
          />
        </Modal>
      )}
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
