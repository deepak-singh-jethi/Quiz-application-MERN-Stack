import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import withDataFetching from "../../../utils/HigerOrderComponent/withDataFetching";
import { QuizzesList } from "../../ui/dashBoard/QuizzesList";
import { GroupsList } from "../../ui/dashBoard/GroupsList";

import MainLayout from "../../ui/MainLayout";

const UserDashboard = () => {
  return (
    <main className="container mx-auto mt-6">
      {" "}
      <div className="grid grid-cols-1 gap-6 mb-6 h-full">
        <UserGroupLists />

        {/* <AdminUpcomingQuizzes /> */}
      </div>
      <div className="w-full my-4">
        {" "}
        <UserFreeQuizzesLists />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-full"></div>
    </main>
  );
};

const UserGroupLists = withDataFetching(GroupsList, {
  URL: "http://localhost:3000/api/v1/group/student/all?limit=4",
  queryKey: ["4-groups"],
});
const UserFreeQuizzesLists = withDataFetching(QuizzesList, {
  URL: "http://localhost:3000/api/v1/quiz?isPublished=true&isFree=true&limit=4",
  queryKey: ["5-live-free-quizzes"],
});
export default UserDashboard;
