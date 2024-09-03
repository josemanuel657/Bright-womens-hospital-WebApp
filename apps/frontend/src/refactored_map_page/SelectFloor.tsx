import React, { useEffect } from "react";
import { FloorType, Path } from "common/src/DataStructures.ts";
import { Button } from "@mui/material";
import "../map_page/FloorSelector.css";
import { useMapContext } from "./MapContext.ts";

export function FloorSelector(): React.JSX.Element {
  const {
    currentFloor,
    setCurrentFloor,
    directionsCounter,
    setDirectionsCounter,
    paths,
    resetZoomingFunction,
  } = useMapContext();

  useEffect(() => {
    if (typeof resetZoomingFunction === "function") {
      console.log("hola");
      resetZoomingFunction();
    } else {
      console.error("resetZoomingFunction is not defined as a function");
    }
  }, [resetZoomingFunction, currentFloor]);

  /*function closestPathNextFloor(floorPaths: Array<number>) : number {
      let closestPath: number = 0;
      floorPaths.some((pathNum: number) => {
          console.log("pathNum: " + pathNum);
          console.log("directionsCounter " + directionsCounter);
          if (pathNum - directionsCounter > 0) {
              closestPath = pathNum;
          } else {
              closestPath = pathNum;
          }
      });
      console.log("made it");
      return closestPath;
  }*/

  const handleOnClick = (floor: FloorType) => {
    setCurrentFloor(floor);

    const floorPaths = new Array<number>();
    let counter = 0;

    if (
      paths.length > 0 &&
      paths[directionsCounter].edges[0].startNode.floor !== floor
    ) {
      paths.forEach((path: Path) => {
        if (path.edges[0].startNode.floor === floor) {
          floorPaths.push(counter);
        }
        counter++;
      });
      if (floorPaths.length > 0) {
        setDirectionsCounter(Math.min(...floorPaths));
      } else {
        setCurrentFloor(paths[directionsCounter].edges[0].startNode.floor);
      }
    }
    //console.log("Path Floor " + paths[directionsCounter].edges[0].startNode.floor);
    //console.log("Current Floor " + currentFloor);
  };

  return (
    <>
      <div className={"btn-container"}>
        <Button
          onClick={() => handleOnClick(FloorType.L2)}
          variant={"contained"}
          sx={{
            backgroundColor:
              currentFloor === FloorType.L2 ? "#012D5A" : "white",
            ":hover": {
              backgroundColor:
                currentFloor === FloorType.L2 ? "#1665c0" : "#e0e0e0",
            },
            height: currentFloor === FloorType.L2 ? "6.5vh" : "5vh",
            width: "10%",
            color: currentFloor === FloorType.L2 ? "white" : "#012D5A",
            // fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            transition: "height 0.15s ease",
          }}
        >
          L2
        </Button>

        <Button
          onClick={() => handleOnClick(FloorType.L1)}
          variant={"contained"}
          sx={{
            backgroundColor:
              currentFloor === FloorType.L1 ? "#012D5A" : "white",
            ":hover": {
              backgroundColor:
                currentFloor === FloorType.L1 ? "#1665c0" : "#e0e0e0",
            },
            height: currentFloor === FloorType.L1 ? "6.5vh" : "5vh",
            width: "10%",
            color: currentFloor === FloorType.L1 ? "white" : "#012D5A",
            // fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            transition: "height 0.05s ease",
          }}
        >
          L1
        </Button>
        <Button
          onClick={() => handleOnClick(FloorType.first)}
          variant={"contained"}
          sx={{
            backgroundColor:
              currentFloor === FloorType.first ? "#012D5A" : "white",
            ":hover": {
              backgroundColor:
                currentFloor === FloorType.first ? "#1665c0" : "#e0e0e0",
            },
            height: currentFloor === FloorType.first ? "6.5vh" : "5vh",
            width: "10%",
            color: currentFloor === FloorType.first ? "white" : "#012D5A",
            // fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            transition: "height 0.05s ease",
          }}
        >
          1
        </Button>
        <Button
          onClick={() => handleOnClick(FloorType.second)}
          variant={"contained"}
          sx={{
            backgroundColor:
              currentFloor === FloorType.second ? "#012D5A" : "white",
            ":hover": {
              backgroundColor:
                currentFloor === FloorType.second ? "#1665c0" : "#e0e0e0",
            },
            height: currentFloor === FloorType.second ? "6.5vh" : "5vh",
            width: "10%",
            color: currentFloor === FloorType.second ? "white" : "#012D5A",
            // fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            transition: "height 0.05s ease",
          }}
        >
          2
        </Button>
        <Button
          onClick={() => handleOnClick(FloorType.third)}
          variant={"contained"}
          sx={{
            backgroundColor:
              currentFloor === FloorType.third ? "#012d5a" : "white",
            ":hover": {
              backgroundColor:
                currentFloor === FloorType.third ? "#1665c0" : "#e0e0e0",
            },
            height: currentFloor === FloorType.third ? "6.5vh" : "5vh",
            width: "10%",
            color: currentFloor === FloorType.third ? "white" : "#012D5A",
            // fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            transition: "height 0.05s ease",
          }}
        >
          3
        </Button>
      </div>
    </>
  );
}

export default FloorSelector;
