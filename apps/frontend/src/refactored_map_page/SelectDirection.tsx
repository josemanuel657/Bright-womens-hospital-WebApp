import React from "react";
import { Button } from "@mui/material";
import { useMapContext } from "./MapContext"; // Adjust the import path as needed
import { EditorMode } from "common/src/types/map_page_types"; // Adjust the import path as needed

function DirectionsSelector() {
  const { directionsCounter, setDirectionsCounter, paths, editorMode } =
    useMapContext();

  const handleOnClick = () => {
    if (paths.length - 1 < directionsCounter + 1) {
      setDirectionsCounter(0);
    } else {
      setDirectionsCounter(directionsCounter + 1);
    }
  };

  if (editorMode !== EditorMode.disabled) {
    return null;
  }

  return (
    <Button
      onClick={handleOnClick}
      sx={{
        // position: "absolute",
        width: "9.5vw",
        backgroundColor: "#012D5A",
        ":hover": {
          backgroundColor: "#1665c0",
        },
        color: "white",
        // fontWeight: "bold",
        // fontFamily: "inter",
        textTransform: "capitalize",
        // boxShadow: 2,
        zIndex: 4,
      }}
    >
      Next Floor
    </Button>
  );
}

export default DirectionsSelector;
