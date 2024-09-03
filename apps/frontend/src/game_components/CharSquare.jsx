import React from "react";

const CharSquare = ({
  getCharacter,
  character,
  onClick,
  wongUnlocked,
  joeUnlocked,
}) => {
  const selected = getCharacter() === character;

  let image = character.head;
  if (
    (character.name === "Joseph" && !joeUnlocked) ||
    (character.name === "Wong" && !wongUnlocked)
  ) {
    image = "/question.png";
  }

  const style = {
    cursor: "pointer",
    border: selected ? "6px solid #FFD700" : "4px solid white", // Highlight if active
    marginLeft: "1px",
    marginRight: "1px",
    marginBottom: "2px",
    backgroundColor: "black",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    width: "135px",
    height: "135px",
  };

  return <div style={style} onClick={onClick}></div>;
};

export default CharSquare;
