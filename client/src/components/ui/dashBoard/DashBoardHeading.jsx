import React, { memo } from "react";
import { Link } from "react-router-dom";

const DashBoardHeadings = memo(({ heading, path, link, hideText }) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-2 md:gap-5">
      {!hideText && (
        <h1 className="text-sm md:text-2xl font-bold text-white">{heading}</h1>
      )}
      {path && !hideText && (
        <Link
          to={link}
          className="text-blue-400 font-semibold underline  md:mr-6 text-sm  md:text-xl hover:text-white">
          {path}
        </Link>
      )}
    </div>
  );
});

export default DashBoardHeadings;
