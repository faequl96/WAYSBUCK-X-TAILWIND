import React from "react";

const Arrow = ({ fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${fill}`}
      id="Layer_1"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 29 29"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="3"
        d="m20.5 11.5-6 6-6-6"
      />
    </svg>
  );
};

export default Arrow;
