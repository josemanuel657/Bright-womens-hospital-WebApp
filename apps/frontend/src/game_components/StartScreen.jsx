import React, { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const StartScreen = () => {
  const startScreenContainer = {
    height: "100vh",
    width: "100vw",
    background:
      "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/backgroundCancerGame.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const retroButton = {
    fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
    fontSize: "2rem", // Increase font size
    color: "black",
    backgroundColor: "#FFFFFF",
    border: "none",
    padding: "20px 40px", // Increase padding
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "12px",
    boxShadow: "0 9px #999", // This creates a 'press' effect
    outline: "none",
  };

  const gameTitle = {
    fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
    fontSize: "4rem",
    textDecoration: "underline",
  };

  const gameDescription = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "2rem",
    paddingLeft: "15%",
    paddingRight: "15%",
  };

  const gameInstructionsHeader = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "2rem",
    paddingLeft: "15%",
    paddingRight: "15%",
    textDecoration: "underline",
  };

  const gameInstructionsBody = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "2rem",
    paddingLeft: "15%",
    paddingRight: "15%",
  };

  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const username = event.target.elements[0].value; // get the value of the text input

    axios
      .post("/api/sign-in-brig-user", { username })
      .then((response) => {
        // handle response here
        console.log(response.data);
        localStorage.setItem("username", username);
        window.location.href = `/character-select`;
      })
      .catch((error) => {
        // handle error here
        console.error(error);
      });
  };

  return (
    <div
      id={"startScreenContainer"}
      style={startScreenContainer}
      className={"container-fluid"}
    >
      <div id={"gameTitle"} style={gameTitle} className={"text-center"}>
        Brigham Breakout!
      </div>
      <div
        id={"gameDescription"}
        style={gameDescription}
        className={"text-center pt-5"}
      >
        Oh No, There's been a contamination leak at Brigham and Women's
        Hospital! See how long you can survive the outbreak of diseases!
      </div>
      <div
        id={"gameInstructionsHeader"}
        style={gameInstructionsHeader}
        className={"text-center pt-5"}
      >
        How To Play:
      </div>
      <div
        id={"gameInstructionsBody"}
        style={gameInstructionsBody}
        className={"text-center pt-5"}
      >
        Use the arrow keys or WASD to move your character around, dodging all
        diseases that fly across the screen. Upon colliding with a disease, you
        will lose one heart. Look out for hearts that appear to refill lost
        health and look out for shields (masks) which can be used for temporary
        invulnerability by pressing 'SPACEBAR' Survive as long as you can! Your
        score is your final time.
      </div>
      <div className={"row"}>
        <div className={"col px-5 text-end"}>
          <img
            id="arrowKey"
            ref={imageRef1}
            src={"/arrowKeys.png"}
            alt="Arrow Keys"
            width={225}
            height={202}
          />
        </div>
        <div className={"col px-5 pt-5"}>
          <img
            id="wasd"
            ref={imageRef2}
            src={"/wasd.png"}
            alt="WASD Keys"
            width={225}
            height={150}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button style={retroButton} onClick={() => setShowModal(true)}>
          PLAY
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {/* Modal Header with pixel art styling */}
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#333333",
            color: "#FFFFFF",
            fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
            fontSize: "16px",
            borderBottom: "3px solid #FFFFFF",
          }}
        >
          <Modal.Title>Enter Username</Modal.Title>
        </Modal.Header>

        {/* Modal Body with pixel art styling */}
        <Modal.Body
          style={{
            backgroundColor: "white",
            color: "#6c6c6c",
            padding: "20px",
            fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
            fontSize: "16px",
            borderColor: "grey",
            borderRadius: "12px",
            maxHeight: "80vh", // Makes the modal body scrollable beyond a certain height
            overflowY: "auto", // Adds a scrollbar when content exceeds the modal body's height
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Username input field with pixel art styling */}
            <input
              type="text"
              required
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "3px solid #FFFFFF",
                backgroundColor: "#757575",
                color: "#FFFFFF",
                fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
                fontSize: "16px",
              }}
            />
            {/* Submit button with pixel art styling */}
            <Button
              type="submit"
              style={{
                backgroundColor: "#4c84af",
                color: "#FFFFFF",
                border: "3px solid #FFFFFF",
                padding: "10px 20px",
                fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              PLAY
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StartScreen;
