import React from "react";

const BBwatermark = () => {
  const waterMarkBG = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: "#141414",
    backgroundImage: "url('/BrighamWatermarkFinal.png')",
    backgroundSize: "25%",
    backgroundPosition: "50% 0", // Add spacing between columns
    width: "100vw", // Adjust to fill the viewport horizontally
    height: "100vh", // Adjust to fill the viewport vertically
    backgroundRepeat: "repeat",
  };

  return <div style={waterMarkBG}></div>;
};

export default BBwatermark;
