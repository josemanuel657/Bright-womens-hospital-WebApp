import React, { useState, useEffect } from "react";

const CharCarruselChunk = ({
  character,
  selectedStatus,
  wongUnlocked,
  joeUnlocked,
}) => {
  const generalStyle = {
    marginLeft: "20%",
    marginRight: "20%",
  };

  const showNothing =
    (character.name === "Joseph" && !joeUnlocked) ||
    (character.name === "Wong" && !wongUnlocked);

  const imageStyle = {
    display: "block",
    margin: "0 auto", // Center the image horizontally
    maxHeight: "100%", // Adjusted height for the image
    maxWidth: "100%", // Adjusted width for the image
  };

  const bioStyle = {
    height: "600px",
    width: "300px",
    backgroundColor: "black",
    border: "5px solid white",
    color: "white",
    fontFamily: "'HISKYFLIPPERHIBOLD', sans-serif",
    opacity: selectedStatus ? 0 : 1, // Add this line
    transition: "opacity 0.2s ease-in-out",
  };

  const portraitStyle = {
    height: "auto", // Dynamic height
    width: "500px",
    backgroundColor: "#161717",
    color: "white",
    fontFamily: "'HISKYFLIPPERHIBOLD', sans-serif",
    backgroundImage: "url('/brighamPortraitBorderFinal.png')",
    backgroundRepeat: "no-repeat", // Prevent background image from repeating
    backgroundSize: "100% 100%", // Stretch background image to cover the container
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2000,
  };

  const statsStyle = {
    height: "600px",
    width: "250px",
    backgroundColor: "black",
    border: "5px solid white",
    color: "white",
    opacity: selectedStatus ? 0 : 1, // Add this line
    transition: "opacity 0.2s ease-in-out",
    fontFamily: "'HISKYFLIPPERHIBOLD', sans-serif",
  };

  const renderSpeedSquares = () => {
    const squares = [];
    let limit = character.speed < 5 ? 5 : character.speed;
    for (let i = 0; i < limit; i++) {
      const backgroundColor = character.speed <= i ? "white" : "#4FC0FF";
      squares.push(
        <div
          key={i}
          style={{
            width: "40px",
            height: "20px",
            backgroundColor: backgroundColor,
            margin: "2px",
          }}
        ></div>,
      );
    }
    return squares;
  };

  const renderHealthSquares = () => {
    const squares = [];
    for (let i = 0; i < 5; i++) {
      const backgroundColor = character.health <= i ? "white" : "#4FC0FF";
      squares.push(
        <div
          key={i}
          style={{
            width: "40px",
            height: "20px",
            backgroundColor: backgroundColor,
            margin: "2px",
          }}
        ></div>,
      );
    }
    return squares;
  };

  const renderDimensionsSquares = () => {
    const squares = [];
    for (let i = 0; i < 5; i++) {
      const backgroundColor = character.size <= i ? "white" : "#4FC0FF";
      squares.push(
        <div
          key={i}
          style={{
            width: "40px",
            height: "20px",
            backgroundColor: backgroundColor,
            margin: "2px",
          }}
        ></div>,
      );
    }
    return squares;
  };

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % character.frames.length);
    }, 200); // Change the interval time as needed

    return () => clearInterval(frameInterval);
  }, [character.frames.length]);

  return (
    <div
      className={"row justify-content-center mt-4 mb-4"}
      style={generalStyle}
    >
      {/* Bio */}
      <div className={"col-lg-3 mx-3"} style={bioStyle}>
        <h3>Role:</h3>
        <p>{showNothing ? "" : character.role}</p>
        <h3 className={"pt-2"}>Quote:</h3>
        <p>{showNothing ? "" : character.quote}</p>
        <h3 className={"pt-2"}>Back Story:</h3>
        <p>{showNothing ? "" : character.backstory}</p>
      </div>
      {/* Portrait */}
      <div className={"col-lg p-2 mx-3"} style={portraitStyle}>
        <h1 className={"mt-5"}>{showNothing ? "" : character.name}</h1>
        <img
          width={"210px"}
          height={"380px"}
          src={showNothing ? "/question.png" : character.frames[currentFrame]} // Use currentFrame
          alt={character.name}
          style={imageStyle}
        />
      </div>
      {/* Stats */}
      <div className={"col-lg-3 mx-3"} style={statsStyle}>
        <h3>Speed</h3>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {!showNothing && renderSpeedSquares()}
        </div>
        <h3 className={"pt-2"}>Health</h3>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {!showNothing && renderHealthSquares()}
        </div>
        <h3 className={"pt-2"}>Evasion</h3>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {!showNothing && renderDimensionsSquares()}
        </div>
        <h3 className={"pt-2"}>Passive:</h3>
        <p className={"mx-1"}>{!showNothing ? character.passive : ""}</p>
      </div>
    </div>
  );
};

export default CharCarruselChunk;
