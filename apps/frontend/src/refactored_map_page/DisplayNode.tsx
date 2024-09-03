import {
  EditorMode,
  NodeDisplayProps,
  OldNewNode,
} from "common/src/types/map_page_types.ts";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  BuildingType,
  Edge,
  FloorType,
  Node,
  NodeType,
  Path,
} from "common/src/DataStructures.ts";
import { useMapContext } from "./MapContext.ts";
import "../styles/DisplayNode.css";
import Typography from "@mui/material/Typography";
import PlaceIcon from "@mui/icons-material/Place";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ElevatorIcon from "@mui/icons-material/Elevator";
import StairsIcon from "@mui/icons-material/Stairs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import {
  displayToImageCoordinates,
  imageToDisplayCoordinates,
} from "./scalingUtils.ts";

export default NodeDisplay;

function sameNode(node1: Node | null, node2: Node | null) {
  if (node1 && node2) {
    return node1.ID == node2.ID;
  } else {
    return false;
  }
}

function startBorderNode(node: Node, path: Path) {
  return path.edges[0].startNode.ID === node.ID;
}

function endBorderNode(node: Node, path: Path) {
  const len: number = path.edges.length;
  if (len === 1) return true;
  return path.edges[len - 1].startNode.ID === node.ID;
}

export function NodeDisplay(props: NodeDisplayProps): React.JSX.Element {
  const [dragged, setDragged] = useState(false);
  //const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const widthScaling = props.scaling.widthScaling;
  const heightScaling = props.scaling.heightScaling;
  const node = props.node;
  const {
    startNode,
    endNode,
    setStartNode,
    setEndNode,
    editorMode,
    setDisableZoomPanning,
    scale,
    paths,
    directionsCounter,
    setDirectionsCounter,
    nodesToBeDeleted,
    setNodesToBeDeleted,
    nodesToBeEdited,
    setNodesToBeEdited,
    showNodes,
    setUnsavedChanges,
    graph,
    setGraph,
    translationY,
    translationX,
    edgeStartNode,
    setEdgeStartNode,
    edgeEndNode,
    setEdgeEndNode,
    edgesToBeAdded,
    setEdgesToBeAdded,
    selectedNodes,
    fixingEdges,
  } = useMapContext();

  const [triggerRed, setTriggerRed] = useState<boolean>(false);

  const [editedNode, setEditedNode] = useState<Node>(
    new Node(
      node.ID,
      node.x,
      node.y,
      node.floor,
      node.building,
      node.type,
      node.longName,
      node.shortName,
    ),
  );
  const [tempNode, setTempNode] = useState<Node>(
    new Node(
      node.ID,
      node.x,
      node.y,
      node.floor,
      node.building,
      node.type,
      node.longName,
      node.shortName,
    ),
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    if (startNode) {
      // Schedule the red animation to start after 2 seconds (the duration of one green animation cycle)
      setTimeout(() => {
        setTriggerRed(true);
      }, 2000); // Duration of the green pulse
    }
  }, [startNode]);

  function nodeInPathChangingFloorStart(node: Node, paths: Array<Path>) {
    if (paths && paths.length > 0) {
      return paths.some((path) => {
        return path.edges.some((edge) => {
          return (
            startBorderNode(node, path) &&
            paths.length >= 0 &&
            directionsCounter < paths.length &&
            (edge.startNode.ID === node.ID || edge.endNode.ID === node.ID) &&
            (node.type === "ELEV" || node.type === "STAI") &&
            paths[directionsCounter].edges[0].startNode.ID === node.ID
          );
        });
      });
    }
    return false;
  }

  function nodeInPathChangingFloorEnd(node: Node, paths: Array<Path>) {
    if (paths && paths.length > 0) {
      return paths.some((path) => {
        return path.edges.some((edge) => {
          return (
            endBorderNode(node, path) &&
            paths.length >= 0 &&
            directionsCounter < paths.length &&
            (edge.startNode.ID === node.ID || edge.endNode.ID === node.ID) &&
            (node.type === "ELEV" || node.type === "STAI") &&
            paths[directionsCounter].edges[
              paths[directionsCounter].edges.length - 1
            ].startNode.ID === node.ID
          );
        });
      });
    }
    return false;
  }

  const handleNodeSelection = (node: Node): void => {
    if (!dragged) {
      if (editorMode !== EditorMode.disabled) {
        setShowModal(true);
        setTempNode(makeNode(editedNode));
        return;
      }
      if (!startNode) {
        setStartNode(node);
        //console.log("Start node: " + node + ", End node: " + null);
      } else if (!endNode) {
        setEndNode(node);
        //console.log("Start node: " + startNode + ", End node: " + node);
      } else {
        setStartNode(node);
        setEndNode(null);
        //console.log("Start node: " + node + ", End node: " + null);
      }
    } else {
      handleMouseUp();
    }
  };

  const { displayX, displayY } = imageToDisplayCoordinates(
    node.x,
    widthScaling,
    node.y,
    heightScaling,
  );

  const changingFloorNodeStyleBack: CSSProperties = {
    position: "absolute",
    left: `${displayX}px`,
    top: `${displayY}px`,
    zIndex: 11,
    marginTop:
      nodeInPathChangingFloorStart(node, paths) &&
      nodeInPathChangingFloorEnd(node, paths) &&
      paths[directionsCounter].edges.length === 1
        ? "25px"
        : 0,
  };

  const changingFloorNodeStyleNext: CSSProperties = {
    position: "absolute",
    left: `${displayX}px`,
    top: `${displayY}px`,
    zIndex: 11,
  };

  const normalNodeStyle: CSSProperties = {
    position: "absolute",
    left: `calc(${displayX}px - 2px)`,
    top: `calc(${displayY}px - 2px)`,
    zIndex: 11,
    borderRadius: "100%",
    padding: "0",
    borderColor: "black",
    backgroundColor: "white",
  };

  const startNodeStyle: CSSProperties = {
    position: "absolute",
    left: `calc(${displayX}px - 12px)`,
    top: `calc(${displayY}px - 22px)`,
    zIndex: 11,
    borderRadius: "100%",
    padding: "0",
    borderColor: "black",
    color: "darkgreen",
    //backgroundColor: "green",
  };

  const endNodeStyle: CSSProperties = {
    position: "absolute",
    left: `calc(${displayX}px - 12px)`,
    top: `calc(${displayY}px - 13px)`,
    zIndex: 11,
    borderRadius: "100%",
    padding: "0",
    borderColor: "black",
    color: "darkred",
    //backgroundColor: "red",
  };

  const hidden: CSSProperties = {
    opacity: 0,
  };
  const [startMousePosition, setStartMousePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDisableZoomPanning(true);
    setDragging(true);
    setDragged(true);
    event.preventDefault();
    const { imageX, imageY } = displayToImageCoordinates(
      event.clientX,
      event.clientY,
      translationX,
      translationY,
      scale,
      widthScaling,
      heightScaling,
    );
    setStartMousePosition({ x: imageX, y: imageY });
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging) return;
      console.log("Mouse Position:", event.clientX, event.clientY);
      console.log("Translations:", translationX, translationY);
      console.log("Scale:", scale);
      console.log("Width & Height Scaling:", widthScaling, heightScaling);
      // Calculate the new position of the node based on mouse movement
      const { imageX, imageY } = displayToImageCoordinates(
        event.clientX,
        event.clientY,
        translationX,
        translationY,
        scale,
        widthScaling,
        heightScaling,
      );
      console.log("Converted Coordinates:", imageX, imageY);
      const deltaX: number = imageX - startMousePosition.x;
      const deltaY: number = imageY - startMousePosition.y;
      console.error(deltaX);

      const newNode: Node = new Node(
        node.ID,
        imageX, //widthScaling,
        imageY, //heightScaling,
        node.floor,
        node.building,
        node.type,
        node.longName,
        node.shortName,
      );

      if (
        graph &&
        selectedNodes.length > 0 &&
        selectedNodes.some((nodeID: string) => nodeID === node.ID)
      ) {
        setStartMousePosition({
          x: startMousePosition.x + deltaX,
          y: startMousePosition.y + deltaY,
        });
        setGraph(graph.editNodes(selectedNodes, deltaX, deltaY));
        setUnsavedChanges(true);
        setIsSaved(false);
      } else {
        setEditedNode(newNode);

        const newOldNewNode: OldNewNode = {
          newNode: editedNode,
          oldNode: node,
        };
        if (graph) {
          setGraph(graph.editNode(editedNode));
        }
        setUnsavedChanges(true);
        setNodesToBeEdited([...nodesToBeEdited, newOldNewNode]);
        setIsSaved(false);
      }
    },
    [
      startMousePosition,
      selectedNodes,
      dragging,
      translationX,
      translationY,
      scale,
      widthScaling,
      heightScaling,
      node,
      graph,
      editedNode,
      nodesToBeEdited,
      setEditedNode,
      setGraph,
      setUnsavedChanges,
      setNodesToBeEdited,
      setIsSaved,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setDragged(false);
    setDisableZoomPanning(false);
    // Possibly finalize position here, or send updates to a server
  }, [setDragging, setDragged, setDisableZoomPanning]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const handleChangingFloorBackNodeClick = () => {
    setDirectionsCounter(directionsCounter - 1);
  };

  const handleChangingFloorNextNodeClick = () => {
    setDirectionsCounter(directionsCounter + 1);
  };

  const handleDeleteNode = (deletedNode: Node): void => {
    if (graph) {
      if (fixingEdges) {
        setGraph(graph.removeNodeFixing(node.ID));
      } else {
        setGraph(graph.removeNode(node.ID));
      }
      setNodesToBeDeleted([...nodesToBeDeleted, deletedNode]);
      setUnsavedChanges(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedNode((prev) => {
      if (!prev) {
        return node;
      }

      return new Node(
        prev.ID,
        name === "x" ? Number(value) : prev.x,
        name === "y" ? Number(value) : prev.y,
        name === "floor" ? (value as FloorType) : prev.floor,
        name === "building" ? (value as BuildingType) : prev.building,
        name === "type" ? (value as NodeType) : prev.type,
        name === "longName" ? value : prev.longName,
        name === "shortName" ? value : prev.shortName,
      );
    });
  };

  function makeNode(node: Node) {
    return new Node(
      node.ID,
      node.x,
      node.y,
      node.floor,
      node.building,
      node.type,
      node.longName,
      node.shortName,
    );
  }

  // oldNode is simply the node that we passed to DisplayNode
  // newNode is the edited node that we created
  useEffect(() => {
    if (isSaved) {
      const newNode: Node = makeNode(editedNode);
      const newOldNewNode: OldNewNode = {
        oldNode: node,
        newNode: newNode,
      };

      if (graph) {
        setGraph(graph.editNode(editedNode));
        setNodesToBeEdited([...nodesToBeEdited, newOldNewNode]);
        setUnsavedChanges(true);
      }
      setIsSaved(false);
    }
  }, [
    graph,
    setGraph,
    node,
    nodesToBeEdited,
    setNodesToBeEdited,
    editedNode,
    isSaved,
    tempNode,
    setUnsavedChanges,
  ]);

  const handleSave = () => {
    setIsSaved(true);
    setShowModal(false);
    setTempNode(makeNode(editedNode));
  };

  const handleClose = () => {
    setShowModal(false);
    setEditedNode(tempNode);
  };

  const handleAddEdge = () => {
    if (!edgeStartNode) {
      setEdgeStartNode(node);
    } else if (!edgeEndNode) {
      setEdgeEndNode(node);
      graph?.addEdge(edgeStartNode.ID + node.ID, edgeStartNode, node);
      setEdgesToBeAdded([
        ...edgesToBeAdded,
        new Edge(edgeStartNode.ID + node.ID, edgeStartNode, node),
      ]);
      setEdgeStartNode(null);
      setEdgeEndNode(null);
    } else {
      setEdgeStartNode(node);
    }
  };

  const selectedNodeStyle: CSSProperties = {
    position: "absolute",
    left: `calc(${displayX}px - 2px)`,
    top: `calc(${displayY}px - 2px)`,
    zIndex: 11,
    borderRadius: "100%",
    padding: "0",
    borderColor: "red",
    backgroundColor: "red",
  };

  if (selectedNodes.some((nodeID: string) => nodeID === node.ID)) {
    return (
      <div>
        <button
          className="node-selector"
          style={{
            ...selectedNodeStyle,
            cursor: dragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onClick={() => handleAddEdge()}
        ></button>
      </div>
    );
  }

  /*useEffect(() => {
        if (editorMode === EditorMode.addEdges) {
          setSelectedOption("showBoth");
        }
      }, [editorMode, setSelectedOption]);*/

  if (editorMode === EditorMode.addEdges) {
    if (showNodes) {
      return (
        <div>
          <button
            className="node-selector"
            style={{
              ...normalNodeStyle,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onClick={() => handleAddEdge()}
          ></button>
        </div>
      );
    }

    return (
      <div>
        {node.type !== NodeType.ELEV &&
        node.type !== NodeType.STAI &&
        node.type !== NodeType.HALL ? (
          <div>
            <button
              className="node-selector"
              style={{
                ...normalNodeStyle,
                cursor: dragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onClick={() => handleAddEdge()}
            ></button>
          </div>
        ) : null}
      </div>
    );
  }

  if (editorMode === EditorMode.disabled) {
    return (
      <>
        {(node.type === NodeType.ELEV || node.type === NodeType.STAI) && (
          <>
            {nodeInPathChangingFloorStart(node, paths) && (
              <React.Fragment>
                {node.type === NodeType.ELEV ? (
                  <div style={changingFloorNodeStyleBack}>
                    <Typography
                      variant="button"
                      onClick={handleChangingFloorBackNodeClick}
                      sx={{
                        color: "#012D5A",
                        fontWeight: "bold",
                        fontFamily: "inter",
                        transition: "font-size 0.3s ease",
                        ":hover": {
                          backgroundColor: "white",
                          fontSize: "1rem",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          ":hover": {
                            backgroundColor: "white",
                          },
                          padding: "2px",
                          borderRadius: "5px",
                        }}
                      >
                        <ElevatorIcon
                          onClick={handleChangingFloorBackNodeClick}
                          sx={{
                            cursor: "pointer",
                          }}
                        />
                        Elevator Back to Floor {""}
                        {
                          paths[directionsCounter - 1].edges[
                            paths[directionsCounter - 1].edges.length - 1
                          ].startNode.floor
                        }
                      </Box>
                    </Typography>
                  </div>
                ) : (
                  <div style={changingFloorNodeStyleBack}>
                    <Typography
                      variant="button"
                      onClick={handleChangingFloorBackNodeClick}
                      sx={{
                        color: "#012D5A",
                        fontWeight: "bold",
                        fontFamily: "inter",
                        transition: "font-size 0.3s ease",
                        marginTop:
                          nodeInPathChangingFloorStart(node, paths) &&
                          nodeInPathChangingFloorEnd(node, paths)
                            ? "50px"
                            : 0,
                        ":hover": {
                          backgroundColor: "white",
                          fontSize: "1rem",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          ":hover": {
                            backgroundColor: "white",
                          },
                          padding: "2px",
                          borderRadius: "5px",
                        }}
                      >
                        <StairsIcon
                          onClick={handleChangingFloorBackNodeClick}
                          sx={{
                            cursor: "pointer",
                          }}
                        />
                        Stairs Back to Floor {""}
                        {
                          paths[directionsCounter - 1].edges[
                            paths[directionsCounter - 1].edges.length - 1
                          ].startNode.floor
                        }
                      </Box>
                    </Typography>
                  </div>
                )}
              </React.Fragment>
            )}
            {nodeInPathChangingFloorEnd(node, paths) && (
              <React.Fragment>
                {node.type === NodeType.ELEV ? (
                  <div style={changingFloorNodeStyleNext}>
                    <Typography
                      variant="button"
                      onClick={handleChangingFloorNextNodeClick}
                      sx={{
                        color: "#012D5A",
                        fontWeight: "bold",
                        fontFamily: "inter",
                        transition: "font-size 0.3s ease",
                        ":hover": {
                          backgroundColor: "white",
                          fontSize: "1rem",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {paths.length > directionsCounter + 1 && (
                        <Box
                          sx={{
                            ":hover": {
                              backgroundColor: "white",
                            },
                            padding: "2px",
                            borderRadius: "5px",
                          }}
                        >
                          <ElevatorIcon
                            onClick={
                              paths.length > directionsCounter + 1
                                ? handleChangingFloorNextNodeClick
                                : undefined
                            }
                            sx={{
                              cursor:
                                paths.length > directionsCounter + 1
                                  ? "pointer"
                                  : "cursor",
                              opacity:
                                paths.length > directionsCounter + 1 ? 1 : 0,
                            }}
                          />
                          Elevator to Floor{" "}
                          {
                            paths[directionsCounter + 1].edges[0].startNode
                              .floor
                          }
                        </Box>
                      )}
                    </Typography>
                  </div>
                ) : (
                  <div style={changingFloorNodeStyleNext}>
                    <Typography
                      variant="button"
                      onClick={handleChangingFloorNextNodeClick}
                      sx={{
                        color: "#012D5A",
                        fontWeight: "bold",
                        fontFamily: "inter",
                        transition: "font-size 0.3s ease",
                        ":hover": {
                          backgroundColor: "white",
                          fontSize: "1rem",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {paths.length > directionsCounter + 1 && (
                        <Box
                          sx={{
                            ":hover": {
                              backgroundColor: "white",
                            },
                            padding: "2px",
                            borderRadius: "5px",
                          }}
                        >
                          <StairsIcon
                            onClick={
                              paths.length > directionsCounter + 1
                                ? handleChangingFloorNextNodeClick
                                : undefined
                            }
                            sx={{
                              cursor:
                                paths.length > directionsCounter + 1
                                  ? "pointer"
                                  : "cursor",
                              opacity:
                                paths.length > directionsCounter + 1 ? 1 : 0,
                            }}
                          />
                          Stairs to Floor{" "}
                          {
                            paths[directionsCounter + 1].edges[0].startNode
                              .floor
                          }
                        </Box>
                      )}
                    </Typography>
                  </div>
                )}
              </React.Fragment>
            )}
            {!nodeInPathChangingFloorStart(node, paths) &&
              !nodeInPathChangingFloorEnd(node, paths) && (
                <button style={hidden} />
              )}
          </>
        )}
        {node.type !== NodeType.ELEV &&
          node.type !== NodeType.STAI &&
          node.type !== NodeType.HALL && (
            <>
              {sameNode(startNode, node) ? (
                <PlaceIcon
                  className="pulseGreen"
                  style={startNodeStyle}
                  onClick={() => handleNodeSelection(node)}
                />
              ) : sameNode(endNode, node) ? (
                <GpsFixedIcon
                  className={triggerRed ? "pulseRed" : "none"}
                  style={endNodeStyle}
                  onClick={() => handleNodeSelection(node)}
                />
              ) : !startNode || !endNode ? (
                <button
                  className="none"
                  style={{
                    ...normalNodeStyle,
                    cursor: dragging ? "grabbing" : "grab",
                  }}
                  onMouseDown={handleMouseDown}
                  onClick={() => handleNodeSelection(node)}
                />
              ) : null}
            </>
          )}
      </>
    );
  }

  if (showNodes) {
    return (
      <div>
        <Dialog open={showModal} onClose={handleClose}>
          <DialogTitle>Node Information</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="ID"
              type="text"
              fullWidth
              name="ID"
              value={node.ID}
            />
            <TextField
              margin="dense"
              label="X-Coordinate"
              type="text"
              fullWidth
              name="x"
              value={editedNode.x}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Y-Coordinate"
              type="text"
              fullWidth
              name="y"
              value={editedNode.y}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Floor"
              type="text"
              fullWidth
              name="floor"
              value={editedNode.floor}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Building"
              type="text"
              fullWidth
              name="building"
              value={editedNode.building}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Type"
              type="text"
              fullWidth
              name="type"
              value={editedNode.type}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Long Name"
              type="text"
              fullWidth
              name="longName"
              value={editedNode.longName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Short Name"
              type="text"
              fullWidth
              name="shortName"
              value={editedNode.shortName}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave}>Save</Button>
            <DeleteForeverIcon
              onClick={() => handleDeleteNode(node)}
              sx={{
                position: "absolute",
                left: 0,
                fontSize: "2rem",
                ":hover": { cursor: "pointer" },
              }}
            />
          </DialogActions>
        </Dialog>
        <button
          className="node-selector"
          style={{ ...normalNodeStyle, cursor: dragging ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown}
          onClick={() => handleNodeSelection(node)}
        >
          {/* Node content here */}
        </button>
      </div>
    );
  }

  return (
    <div>
      {node.type !== NodeType.ELEV &&
      node.type !== NodeType.STAI &&
      node.type !== NodeType.HALL ? (
        <div>
          <Dialog open={showModal} onClose={handleClose}>
            <DialogTitle>Node Information</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="ID"
                type="text"
                fullWidth
                name="ID"
                value={node.ID}
              />
              <TextField
                margin="dense"
                label="X-Coordinate"
                type="text"
                fullWidth
                name="x"
                value={editedNode.x}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Y-Coordinate"
                type="text"
                fullWidth
                name="y"
                value={editedNode.y}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Floor"
                type="text"
                fullWidth
                name="floor"
                value={editedNode.floor}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Building"
                type="text"
                fullWidth
                name="building"
                value={editedNode.building}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Type"
                type="text"
                fullWidth
                name="type"
                value={editedNode.type}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Long Name"
                type="text"
                fullWidth
                name="longName"
                value={editedNode.longName}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Short Name"
                type="text"
                fullWidth
                name="shortName"
                value={editedNode.shortName}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave}>Save</Button>
              <DeleteForeverIcon
                onClick={() => handleDeleteNode(node)}
                sx={{
                  position: "absolute",
                  left: 0,
                  fontSize: "2rem",
                  ":hover": { cursor: "pointer" },
                }}
              />
            </DialogActions>
          </Dialog>
          <button
            className="node-selector"
            style={{
              ...normalNodeStyle,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onClick={() => handleNodeSelection(node)}
          >
            {/* Optionally, you can include node display content here */}
          </button>
        </div>
      ) : null}
    </div>
  );
}
