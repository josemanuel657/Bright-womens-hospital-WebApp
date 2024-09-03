import React from "react";
import {
  Autocomplete,
  TextField,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "../map_page/LocationSelector.css";
import { Node } from "common/src/DataStructures.ts";
import { useMapContext } from "./MapContext.ts";
import { EditorMode } from "common/src/types/map_page_types.ts";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import PlaceIcon from "@mui/icons-material/Place";
import ImportExportIcon from "@mui/icons-material/ImportExport";

function LocationSelector(): React.JSX.Element {
  const {
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    setCurrentFloor,
    editorMode,
    graph,
  } = useMapContext();

  if (editorMode !== EditorMode.disabled) {
    return <></>;
  }

  const handleLocationChange = (newValue: Node | null) => {
    if (newValue) {
      setCurrentFloor(newValue.floor);
    }
    setStartNode(newValue);
  };

  const handleDestinationChange = (newValue: Node | null) => {
    setEndNode(newValue);
  };

  return (
    <div className="locationSelector">
      <IconButton
        sx={{
          height: "40px",
          marginRight: "8px",
        }}
        onClick={() => {
          const temp = startNode;
          handleLocationChange(endNode);
          handleDestinationChange(temp);
        }}
      >
        <ImportExportIcon />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Autocomplete
          value={startNode}
          onChange={(event, newValue) => handleLocationChange(newValue)}
          options={
            graph
              ? graph
                  .getNodesAll()
                  .sort((a, b) => a.longName.localeCompare(b.longName))
                  .filter(
                    (node) =>
                      node.type !== "ELEV" &&
                      node.type !== "STAI" &&
                      node.type !== "HALL",
                  )
              : new Array<Node>()
          }
          getOptionLabel={(node) => node.longName}
          size={"small"}
          renderInput={(params) => (
            <TextField
              placeholder={"Enter Start Location"}
              {...params}
              sx={{
                backgroundColor: "white",
                width: "20vw",
                color: "black",
                borderRadius: "5px",
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Autocomplete
          value={endNode}
          onChange={(event, newValue) => handleDestinationChange(newValue)}
          options={
            graph
              ? graph
                  .getNodesAll()
                  .sort((a, b) => a.longName.localeCompare(b.longName))
                  .filter(
                    (node) =>
                      node.type !== "ELEV" &&
                      node.type !== "STAI" &&
                      node.type !== "HALL",
                  )
              : new Array<Node>()
          }
          getOptionLabel={(node) => node.longName}
          size={"small"}
          renderInput={(params) => (
            <TextField
              placeholder={"Enter Destination"}
              {...params}
              sx={{
                backgroundColor: "white",
                width: "20vw",
                color: "black",
                borderRadius: "5px",
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <ModeStandbyIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>
    </div>
  );
}
export default LocationSelector;
