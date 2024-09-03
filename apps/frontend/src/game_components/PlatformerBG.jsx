import React from "react";

const PlatformerBG = ({ canvasWidth, canvasHeight }) => {
  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundImage: "url('/backgroundCancerGame.png')",
    backgroundSize: `${canvasWidth}px ${canvasHeight}px`, // Set background size based on canvas dimensions
    backgroundRepeat: "no-repeat",
  };

  return <div style={containerStyle}></div>;
};

export default PlatformerBG;
