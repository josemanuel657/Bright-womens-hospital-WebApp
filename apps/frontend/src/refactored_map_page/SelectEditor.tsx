import React, { useState } from "react";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useMapContext } from "./MapContext.ts";
import { EditorMode } from "common/src/types/map_page_types.ts";
import HandymanIcon from "@mui/icons-material/Handyman";
import CommitIcon from "@mui/icons-material/Commit";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CloseIcon from "@mui/icons-material/Close";

export default function EditorSelector() {
  const { setEditorMode } = useMapContext();

  const [open, setOpen] = React.useState(false);
  const [currentIcon, setCurrentIcon] = useState(<HandymanIcon />);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = (editMode: EditorMode) => {
    setEditorMode(editMode);
    if (editMode === EditorMode.editMode) {
      setCurrentIcon(<EditIcon />);
    } else if (editMode === EditorMode.addEdges) {
      setCurrentIcon(<CommitIcon />);
    } else if (editMode === EditorMode.addNodes) {
      setCurrentIcon(<AddLocationAltIcon />);
    } else {
      setCurrentIcon(<HandymanIcon />);
    }
    setOpen(false);
  };

  const actions = [
    { icon: <EditIcon />, name: "Edit Mode", mode: EditorMode.editMode },
    { icon: <CommitIcon />, name: "Add Edges", mode: EditorMode.addEdges },
    {
      icon: <AddLocationAltIcon />,
      name: "Add Nodes",
      mode: EditorMode.addNodes,
    },
    { icon: <CloseIcon />, name: "Exit Edit Mode", mode: EditorMode.disabled },
  ];

  return (
    <Box>
      <SpeedDial
        ariaLabel="Edit Toolbox"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          marginBottom: "2vh",
          marginLeft: "1vw",
          zIndex: 2,
          "& .MuiButtonBase-root": {
            backgroundColor: "#012D5A",
          },
        }}
        icon={currentIcon}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipPlacement={"right"}
            onClick={() => handleClick(action.mode)}
            sx={{
              backgroundColor: "white!important",
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
