import React from "react";

const CharArrow = ({ direction, onClick }) => {
  const arrowImg = `/${direction}-arrow.png`;

  // Define styles for left and right arrows
  const arrowStyle = {
    cursor: "pointer",
    float: direction === "left" ? "right" : "left",
    marginRight: direction === "left" ? "10px" : "0",
    marginLeft: direction === "right" ? "10px" : "0",
  };

  return (
    <div onClick={onClick} style={arrowStyle}>
      <img src={arrowImg} alt={arrowImg} />
    </div>
  );
};

export default CharArrow;
