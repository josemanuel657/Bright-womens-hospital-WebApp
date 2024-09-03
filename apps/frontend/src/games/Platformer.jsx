import React, { Component } from "react";
import Canvas from "../game_components/Canvas";
import BBwatermark from "../game_components/BBwatermark.jsx";

class Platformer extends Component {
  render() {
    return (
      <>
        <BBwatermark />
        <Canvas />
      </>
    );
  }
}

export default Platformer;
