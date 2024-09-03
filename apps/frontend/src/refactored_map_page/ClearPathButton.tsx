import React from "react";

import { IconButton } from "@mui/material";
import { useMapContext } from "./MapContext";
import { EditorMode } from "common/src/types/map_page_types.ts";
import ClearIcon from "@mui/icons-material/Clear";

const ClearPathButton: React.FC = () => {
  const { setStartNode, setEndNode, editorMode, startNode, endNode } =
    useMapContext();

  const handleClick = () => {
    setStartNode(null);
    setEndNode(null);
  };

  if (editorMode !== EditorMode.disabled) {
    return null;
  }

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        marginRight: "8px",
      }}
      disabled={!startNode || !endNode}
    >
      <ClearIcon />
    </IconButton>
  );
};

export default ClearPathButton;
