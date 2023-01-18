import React from "react";

const Spinner = ({ fill }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${fill}`}
        style={{
          margin: "auto",
          background: "rgba(255, 255, 255, 0)",
          display: "block",
          shapeRendering: "auto",
          animationPlayState: "running",
          animationDelay: "0s",
        }}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          r="42"
          strokeDasharray="197.92033717615698 67.97344572538566"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
      </svg>
    </>
  );
};

export default Spinner;
