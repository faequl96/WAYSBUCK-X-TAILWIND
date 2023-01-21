import React from "react";

const X = ({fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className={fill}>
      <path
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 1 1 13M1 1l12 12"
      />
    </svg>
  );
};

export default X;
