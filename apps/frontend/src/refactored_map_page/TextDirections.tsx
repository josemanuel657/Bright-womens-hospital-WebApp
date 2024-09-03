import { Path, Edge, NodeType } from "common/src/DataStructures.ts";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useMapContext } from "./MapContext.ts";
import { Box, Button, ButtonGroup, Dialog, IconButton } from "@mui/material";
import { EditorMode } from "common/src/types/map_page_types.ts";
import styles from "../styles/TextDirections.module.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnSlightRightIcon from "@mui/icons-material/TurnSlightRight";
import TurnSlightLeftIcon from "@mui/icons-material/TurnSlightLeft";
import StraightIcon from "@mui/icons-material/Straight";
import EastIcon from "@mui/icons-material/East";
import ElevatorIcon from "@mui/icons-material/Elevator";
import StairsIcon from "@mui/icons-material/Stairs";
import PlaceIcon from "@mui/icons-material/Place";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "qrcode.react";

function QRPopup({ textDirections }: { textDirections: string[] }) {
  const value = textDirections.join("\n");
  return <QRCode value={value} />;
}

export default TextDirections;

function TextDirections() {
  const {
    paths,
    startNode,
    endNode,
    directionsCounter,
    setDirectionsCounter,
    editorMode,
    currentFloor,
  } = useMapContext();

  const [directionsText, setDirectionsText] = useState<Array<string>>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    // Adjust height immediately on toggle
    if (expanded) {
      setMaxHeight("0px"); // Collapse
    } else {
      if (contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      }
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (expanded && contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      }
    };
    updateSize(); // Call when component mounts or updates
    window.addEventListener("resize", updateSize); // Adjust if window size changes
    return () => window.removeEventListener("resize", updateSize);
  }, [expanded]);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [directionsText, expanded]);

  const prevDirectionRef = useRef("");
  const floorPaths = useRef(new Array<Path>());
  let prevPathIndex: number = directionsCounter;
  let nextPathIndex: number = directionsCounter;
  const directionsPerPage = 5;

  useEffect(() => {
    floorPaths.current = [];
    if (paths) {
      paths.forEach((path: Path) => {
        if (path.edges[0].startNode.floor === currentFloor) {
          floorPaths.current.push(path);
        }
      });
    }
  }, [currentFloor, paths]);

  const generateDirections = useCallback(
    (paths: Array<Path>) => {
      const directions: Array<string> = [];
      let floorChangeDirection = null;
      let arrive = null;

      if (paths[directionsCounter] && paths[directionsCounter].edges) {
        const currentPathEdges: Array<Edge> = paths[directionsCounter].edges;
        if (directionsCounter === 0) {
          directions.push(`Start at ${currentPathEdges[0].startNode.longName}`);
        }
        if (currentPathEdges) {
          if (paths[directionsCounter] === paths[paths.length - 1]) {
            arrive = `Arrive at ${currentPathEdges[currentPathEdges.length - 1].endNode.longName}`;
          }
        }
        // } else if (directionsCounter === paths.length - 1) {
        //   arrive = `Arrive at ${currentPathEdges[currentPathEdges.length - 1].endNode.longName}`;
        // }
        for (let i = 0; i < currentPathEdges.length - 1; i++) {
          const currentEdge = currentPathEdges[i];
          const nextEdge = currentPathEdges[i + 1];

          if (nextEdge.startNode.type == NodeType.ELEV) {
            floorChangeDirection = `Take ${nextEdge.startNode.shortName} to floor ${nextEdge.endNode.floor}`;
          } else if (nextEdge.startNode.type == NodeType.STAI) {
            floorChangeDirection = `Take ${nextEdge.startNode.shortName} to floor ${nextEdge.endNode.floor}`;
          }

          if (currentEdge.startNode.type) {
            const dx1 = currentEdge.endNode.x - currentEdge.startNode.x;
            const dy1 = currentEdge.endNode.y - currentEdge.startNode.y;
            const dx2 = nextEdge.endNode.x - nextEdge.startNode.x;
            const dy2 = nextEdge.endNode.y - nextEdge.startNode.y;

            const angle1 = Math.atan2(dy1, dx1);
            const angle2 = Math.atan2(dy2, dx2);
            const angleDifference = angle2 - angle1;

            // Normalize angleDifference to the range of -π to π
            const normalizedAngleDifference = Math.atan2(
              Math.sin(angleDifference),
              Math.cos(angleDifference),
            );

            let direction: string;

            if (Math.abs(normalizedAngleDifference) < Math.PI / 10) {
              if (prevDirectionRef.current !== "Continue straight") {
                direction = "Continue straight";
              } else {
                continue;
              }
            } else if (
              normalizedAngleDifference > 0 &&
              Math.abs(normalizedAngleDifference) < Math.PI / 5
            ) {
              direction = "Bear right";
            } else if (
              normalizedAngleDifference < 0 &&
              Math.abs(normalizedAngleDifference) < Math.PI / 5
            ) {
              direction = "Bear left";
            } else if (normalizedAngleDifference > 0) {
              direction = "Turn right";
            } else if (normalizedAngleDifference < 0) {
              direction = "Turn left";
            } else {
              continue;
            }

            // Update the ref with the new direction
            prevDirectionRef.current = direction;

            let detail: string;

            if (direction === "Continue straight") {
              detail = "";
            } else {
              if (currentEdge.startNode.type === NodeType.HALL) {
                if (nextEdge.endNode.type === NodeType.HALL) {
                  detail = "";
                } else {
                  detail = ` towards ${nextEdge.endNode.longName}`;
                }
              } else {
                if (nextEdge.endNode.type === NodeType.HALL) {
                  detail = ` at ${currentEdge.startNode.longName}`;
                } else {
                  detail = "";
                }
              }
            }

            /*if (currentPathEdges[i + 2]) {
                                   const nextNextEdge = currentPathEdges[i + 2];
                                   const dx3 = nextNextEdge.endNode.x - nextNextEdge.startNode.x;
                                   const dy3 = nextNextEdge.endNode.y - nextNextEdge.startNode.y;
                                   const angle3 = Math.atan2(dy3, dx3);
                                   const angleDifferenceStraightCheck = angle3 - angle1;
                                   const normalizedAngleDifferenceStraightCheck = Math.atan2(Math.sin(angleDifferenceStraightCheck), Math.cos(angleDifferenceStraightCheck));
                                   if (nextNextEdge) {
                                       if(Math.abs(normalizedAngleDifferenceStraightCheck) < Math.PI / 20 ) {
                                           continue;
                                       }
                                   }
                               }*/

            directions.push(`${direction}${detail}`);
          }
        }
      }

      if (
        paths[directionsCounter] &&
        paths[directionsCounter].edges &&
        directions.length === 0
      ) {
        directions.push(
          `Continue straight towards ${paths[directionsCounter].edges[0].endNode.longName}`,
        );
      }

      if (floorChangeDirection) {
        directions.push(floorChangeDirection);
      }

      if (arrive) {
        directions.push(arrive);
      }

      return directions;
    },
    [directionsCounter],
  );

  const [allFloorsDirections, setAllFloorsDirections] = useState<Array<string>>(
    [],
  );
  const [qrCode, setQrCode] = useState<React.ReactNode>(null);

  const generateAllFloorsDirections = useCallback(() => {
    const allDirections: Array<string[]> = paths.map((path) =>
      generateDirections([path]),
    );
    setAllFloorsDirections(allDirections.flat());
    console.log(allDirections.flat());
  }, [paths, generateDirections]);

  useEffect(() => {
    generateAllFloorsDirections();
  }, [generateAllFloorsDirections]);

  useEffect(() => {
    if (allFloorsDirections.length > 0) {
      setQrCode(<QRPopup textDirections={allFloorsDirections} />);
    }
  }, [allFloorsDirections]);

  useEffect(() => {
    const newDirections: Array<string> = generateDirections(paths);
    setDirectionsText(newDirections);

    const currentNumPages = Math.ceil(newDirections.length / directionsPerPage);

    if (currentPage >= currentNumPages) {
      setCurrentPage(currentNumPages > 0 ? currentNumPages - 1 : 0);
    }
  }, [paths, generateDirections, currentPage]);

  if (editorMode !== EditorMode.disabled) {
    return <></>;
  }

  let numPages: number = 0;
  let pagedDirections: Array<string> = [];

  if (paths) {
    numPages = Math.ceil(directionsText.length / directionsPerPage);
    pagedDirections = directionsText.slice(
      currentPage * directionsPerPage,
      (currentPage + 1) * directionsPerPage,
    );
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPath = () => {
    for (let i = directionsCounter + 1; i < paths.length; i++) {
      if (floorPaths.current.includes(paths[i])) {
        nextPathIndex = i;
        break;
      }
    }
    setDirectionsCounter(nextPathIndex);
  };

  const handlePrevPath = () => {
    for (let i = 0; i < paths.length - 1; i++) {
      if (i < directionsCounter && floorPaths.current.includes(paths[i])) {
        prevPathIndex = i;
      }
    }
    setDirectionsCounter(prevPathIndex);
  };

  const getIcon = (direction: string) => {
    if (direction.includes("Turn right")) {
      return <TurnRightIcon />;
    } else if (direction.includes("Turn left")) {
      return <TurnLeftIcon />;
    } else if (direction.includes("Bear right")) {
      return <TurnSlightRightIcon />;
    } else if (direction.includes("Bear left")) {
      return <TurnSlightLeftIcon />;
    } else if (direction.includes("Continue straight")) {
      return <StraightIcon />;
    } else if (direction.includes("Take")) {
      if (direction.includes("Elevator")) {
        return <ElevatorIcon />;
      } else {
        return <StairsIcon />;
      }
    } else if (direction.includes("Start")) {
      return <PlaceIcon />;
    } else if (direction.includes("Arrive")) {
      return <ModeStandbyIcon />;
    } else {
      return null;
    }
  };

  const prevPathDisabled =
    floorPaths.current.findIndex((path) => path === paths[directionsCounter]) <=
    0;
  const nextPathDisabled =
    floorPaths.current.findIndex((path) => path === paths[directionsCounter]) >=
    floorPaths.current.length - 1;

  return (
    <div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box sx={{ padding: "1rem" }}>{qrCode}</Box>
      </Dialog>
      {startNode && endNode ? (
        <div className={`${styles.directionsContainer}`}>
          <div className={`${styles.textDirectionsContainer}`}>
            <div className={styles.directionsHeader}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "8px" }}>Text Directions</h5>
                <IconButton onClick={() => setDialogOpen(true)}>
                  <QrCodeIcon />
                </IconButton>
              </div>
              <IconButton onClick={toggleExpanded}>
                {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </div>
            <div
              ref={contentRef}
              style={{
                maxHeight: maxHeight,
                overflow: "hidden",
                transition: "max-height 0.2s ease-in-out",
              }}
            >
              <div className={`${styles.directionsContent}`}>
                {pagedDirections.map((direction, i) => (
                  <div key={i} className={`${styles.directionsText}`}>
                    {getIcon(direction)}
                    <p>{direction}</p>
                  </div>
                ))}
              </div>
              <div className={`${styles.directionsFooter}`}>
                <div className={`${styles.pagination}`}>
                  <p
                    style={{
                      marginRight: "16px",
                    }}
                  >
                    Page {currentPage + 1} of {numPages}
                  </p>
                  <ButtonGroup size="small">
                    <Button
                      onClick={handlePrevPath}
                      disabled={prevPathDisabled}
                      sx={{
                        height: "2rem",
                        minWidth: "5rem",
                        backgroundColor: "white",
                        color: "#012D5A",
                        fontFamily: "inter",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        borderRadius: "4px",
                        border: "1px solid #c4c4c4",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          borderColor: "#a8a8a8",
                        },
                        "&:disabled": {
                          backgroundColor: "#f5f5f5",
                          color: "#c4c4c4",
                        },
                      }}
                    >
                      Prev Path
                    </Button>

                    <Button
                      onClick={handleNextPath}
                      disabled={nextPathDisabled}
                      sx={{
                        height: "2rem",
                        minWidth: "5rem",
                        backgroundColor: "white",
                        color: "#012D5A",
                        fontFamily: "inter",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        borderRadius: "4px",
                        border: "1px solid #c4c4c4",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          borderColor: "#a8a8a8",
                        },
                        "&:disabled": {
                          backgroundColor: "#f5f5f5",
                          color: "#c4c4c4",
                        },
                      }}
                    >
                      Next Path
                    </Button>
                  </ButtonGroup>
                  <div>
                    <IconButton
                      onClick={handlePrevPage}
                      disabled={currentPage == 0}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextPage}
                      disabled={currentPage + 1 == numPages}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Box className={`${styles.textDirectionFloorGroup}`}>
            {paths.map((path, i) => (
              <Box
                key={i}
                sx={{
                  color:
                    paths[directionsCounter] === path ? "#2196F3" : "#012D5A",
                  flexDirection: "row",
                  justifyContent: "space between",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setDirectionsCounter(i)}
                >
                  {path.edges[0].startNode.floor}
                </Box>
                {paths.length - 1 === i ? null : (
                  <EastIcon
                    sx={{
                      color: "black",
                      fontSize: "1rem",
                      margin: "4px",
                    }}
                  ></EastIcon>
                )}
              </Box>
            ))}
          </Box>
        </div>
      ) : null}
    </div>
  );
}
