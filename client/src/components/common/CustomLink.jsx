import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const CustomLink = ({
  children,
  to,
  setIndex,
  index,
  activeIndex,
  ...props
}) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div className="relative" onClick={setIndex}>
      <Link
        to={to}
        {...props}
        className={`${match ? "sidebar-item-active" : "sidebar-item"} `}
      >
        {children}
      </Link>
      {match && index === activeIndex && (
        <span className="absolute inset-y-0 left-0 w-1 bg-gray-600 rounded-tr-lg rounded-br-lg"></span>
      )}
    </div>
  );
};

export default CustomLink;
