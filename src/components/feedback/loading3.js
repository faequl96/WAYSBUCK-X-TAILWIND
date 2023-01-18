import React from "react";

const Loading = ({ fill }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${fill}`}
        style={{
          margin: "auto",
          background: "none",
          display: "block",
          shapeRendering: "auto",
        }}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <rect x="17.5" y="27.5" width="15" height="45" fill="currentFill">
          <animate
            attributeName="y"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="5;27.5;27.5"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.2s"
          ></animate>
          <animate
            attributeName="height"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="90;45;45"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.2s"
          ></animate>
        </rect>
        <rect x="42.5" y="27.5" width="15" height="45" fill="currentFill">
          <animate
            attributeName="y"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="10.625;27.5;27.5"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.1s"
          ></animate>
          <animate
            attributeName="height"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="78.75;45;45"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            begin="-0.1s"
          ></animate>
        </rect>
        <rect x="67.5" y="27.5" width="15" height="45" fill="currentFill">
          <animate
            attributeName="y"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="10.625;27.5;27.5"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          ></animate>
          <animate
            attributeName="height"
            repeatCount="indefinite"
            dur="1s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="78.75;45;45"
            keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          ></animate>
        </rect>
      </svg>
    </>
  );
};

export default Loading;
