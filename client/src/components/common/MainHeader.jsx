import React from "react";

const MainHeader = ({ text }) => {
  return (
    <div className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      {text}
    </div>
  );
};

export default MainHeader;
