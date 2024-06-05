import React, { memo } from "react";
import { Link } from "react-router-dom";

const DashBoardHeadings = memo(({ heading, path, link }) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-5">
      <h1 className="text-xl md:text-2xl font-bold text-white">{heading}</h1>
      {path && (
        <Link to={link} className="text-blue-600 font-semibold underline">
          {path}
        </Link>
      )}
    </div>
  );
});

export default DashBoardHeadings;
