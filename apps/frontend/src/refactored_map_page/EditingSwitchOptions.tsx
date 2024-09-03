import React from "react";
import {
  Switch,
  FormControlLabel,
  Box,
  Typography,
  SvgIconProps,
} from "@mui/material";
import { useMapContext } from "./MapContext";
import { EditorMode } from "common/src/types/map_page_types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BuildIcon from "@mui/icons-material/Build";
import ContentCutIcon from "@mui/icons-material/ContentCut";

export default EditingSwitchOptions;

function EditingSwitchOptions() {
  const {
    setShowNodes,
    setShowEdges,
    showNodes,
    showEdges,
    editorMode,
    fixingEdges,
    setFixingEdges,
  } = useMapContext();

  if (editorMode === EditorMode.disabled) {
    return null;
  }

  const handleToggleNodes = () => {
    setShowNodes(!showNodes);
  };

  const handleToggleEdges = () => {
    setShowEdges(!showEdges);
  };

  const handleToggleEdgeRepair = () => {
    setFixingEdges(!fixingEdges);
  };

  type CustomLabelProps = {
    icon: React.ReactElement<SvgIconProps>;
    label: string;
    isActive: boolean;
  };

  const CustomLabel: React.FC<CustomLabelProps> = ({
    icon,
    label,
    isActive,
  }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {isActive
        ? icon
        : React.cloneElement(icon, {
            component:
              icon.type === BuildIcon ? ContentCutIcon : VisibilityOffIcon,
          })}
      <Typography>{label}</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "white",
        boxShadow: 7,
        borderRadius: "5px",
        height: "auto",
        marginTop: "2vh",
        marginLeft: "1vw",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 3,
        "& .MuiTypography-root": {
          fontFamily: "inter",
          fontWeight: "bold",
        },
      }}
    >
      <FormControlLabel
        label={
          <CustomLabel
            icon={<BuildIcon />}
            label="Auto Repair Edges"
            isActive={fixingEdges}
          />
        }
        labelPlacement="start"
        control={
          <Switch
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: fixingEdges ? "#1976d2" : "#012D5A",
              },
            }}
            checked={fixingEdges}
            onChange={handleToggleEdgeRepair}
          />
        }
        sx={{
          justifyContent: "left",
          width: "100%",
        }}
      />
      <FormControlLabel
        label={
          <CustomLabel
            icon={<VisibilityIcon />}
            label="Show All Nodes"
            isActive={showNodes}
          />
        }
        labelPlacement="start"
        control={
          <Switch
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: showNodes ? "#1976d2" : "#012D5A",
              },
            }}
            checked={showNodes}
            onChange={handleToggleNodes}
          />
        }
        sx={{
          justifyContent: "left",
          width: "100%",
        }}
      />
      <FormControlLabel
        label={
          <CustomLabel
            icon={<VisibilityIcon />}
            label="Show All Edges"
            isActive={showEdges}
          />
        }
        labelPlacement="start"
        control={
          <Switch
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: showEdges ? "#1976d2" : "#012D5A",
              },
            }}
            checked={showEdges}
            onChange={handleToggleEdges}
          />
        }
        sx={{
          justifyContent: "left",
          width: "100%",
        }}
      />
    </Box>
  );
}
