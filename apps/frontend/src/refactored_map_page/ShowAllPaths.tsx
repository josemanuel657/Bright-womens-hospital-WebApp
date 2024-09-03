import React, { useState } from "react";
import { Button } from "@mui/material";
import { useMapContext } from "./MapContext";
import { EditorMode } from "common/src/types/map_page_types";

function ShowPathsButton() {
  const { showPaths, setShowPaths, editorMode } = useMapContext();

  const [hoverActive, setHoverActive] = useState(false);

  const handleMouseEnter = () => {
    setHoverActive(true);
  };

  const handleMouseLeave = () => {
    setHoverActive(false);
  };

  const handleOnClick = () => {
    setShowPaths(!showPaths);
    setHoverActive(false);
  };

  if (editorMode !== EditorMode.disabled) {
    return null;
  }

  return (
    <Button
      onClick={handleOnClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        // position: "absolute",
        width: "9.5vw",
        backgroundColor: showPaths ? "#1665c0" : "#012D5A",
        color: "white",
        // fontWeight: "bold",
        // fontFamily: "inter",
        textTransform: "capitalize",
        // boxShadow: 2,
        zIndex: 4,
        // marginLeft: "9vw",
        // marginTop: "32vh",
        // fontSize: "0.8rem",
        ":hover": {
          backgroundColor: hoverActive
            ? showPaths
              ? "#012D5A!important"
              : "#1665c0!important"
            : showPaths
              ? "#1665c0!important"
              : "#012D5A!important",
        },
      }}
    >
      Show Paths
    </Button>
  );
}

export default ShowPathsButton;
