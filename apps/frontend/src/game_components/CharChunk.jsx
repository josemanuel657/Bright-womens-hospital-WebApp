import React, { useState, useEffect } from "react";
import { allCharacters } from "./Characters";
import CharSquare from "./CharSquare.jsx";

const CharChunk = ({
  getCharacter,
  setCurrentIndex,
  selectedStatus,
  joeUnlocked,
  wongUnlocked,
}) => {
  // Define the styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    opacity: selectedStatus ? 0 : 1, // Add this line
    transition: "opacity 0.2s ease-in-out",
    zIndex: 2000,
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    color: "white",
  };

  const buttonStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    margin: "20px",
  };

  const [isSecondFrame, setIsSecondFrame] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSecondFrame((prevIsSecondFrame) => !prevIsSecondFrame);
    }, 500); // Change frame every 0.5 seconds

    return () => clearInterval(interval);
  }, []);

  const buttonImage = isSecondFrame ? "/backbutton2.png" : "/backbutton1.png";

  // Adjust button position and size for the second frame
  const buttonStyles = isSecondFrame
    ? {
        ...buttonStyle,
        top: "10px", // Move down by 30 pixels
        height: "50px", // Lower height by 25 pixels
      }
    : buttonStyle;

  return (
    <div style={containerStyle}>
      <div style={buttonStyles}>
        <a href={"/brigham-breakout-start"}>
          <img
            src={buttonImage}
            width={"150px"}
            height={"85px"}
            alt={"Back Button"}
          />
        </a>
      </div>
      <div style={rowStyle}>
        {/* Map over the first 7 indexes */}
        {allCharacters.slice(0, 7).map((character, index) => (
          <div key={index}>
            <CharSquare
              character={character}
              onClick={() => setCurrentIndex(index)}
              getCharacter={getCharacter}
              joeUnlocked={joeUnlocked}
              wongUnlocked={wongUnlocked}
            />
          </div>
        ))}
      </div>
      <div style={rowStyle}>
        {/* Map over the next 6 indexes */}
        {allCharacters.slice(7, 13).map((character, index) => (
          <div key={index + 7}>
            <CharSquare
              joeUnlocked={joeUnlocked}
              wongUnlocked={wongUnlocked}
              character={character}
              onClick={() => setCurrentIndex(index + 7)}
              getCharacter={getCharacter}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharChunk;
