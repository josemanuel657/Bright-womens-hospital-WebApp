import { BuildingMap, FloorMap } from "common/src/BuildingClasses.ts";
import {
  BuildingType,
  Edge,
  FloorType,
  Node,
  NodeType,
} from "common/src/DataStructures.ts";
import GraphFrontend from "./GraphFrontend.ts";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EdgeDisplayProps,
  EditorMode,
  NodeDisplayProps,
  PathDisplayProps,
} from "common/src/types/map_page_types.ts";
import axios from "axios";
import { useMapContext } from "./MapContext.ts";
import PathDisplay from "./DisplayPath.tsx";
import NodeDisplay from "./DisplayNode.tsx";
import EdgeDisplay from "./DisplayEdge.tsx";
import { displayToImageCoordinates, getScaling } from "./scalingUtils.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import SelectionBox, { SelectionBoxProps } from "./selectionBox.tsx";

export default FloorDisplay;

const buildingMap: BuildingMap = new BuildingMap([
  new FloorMap("00_thelowerlevel1.png", FloorType.L1),
  new FloorMap("00_thelowerlevel2.png", FloorType.L2),
  new FloorMap("01_thefirstfloor.png", FloorType.first),
  new FloorMap("02_thesecondfloor.png", FloorType.second),
  new FloorMap("03_thethirdfloor.png", FloorType.third),
]);

function FloorDisplay() {
  const {
    currentFloor,
    showNodes,
    setGraph,
    graph,
    scale,
    editorMode,
    translationX,
    translationY,
    setUnsavedChanges,
    setDisableZoomPanning,
    nodesToBeAdded,
    setNodesToBeAdded,
    setSelectedNodes,
  } = useMapContext();

  useEffect(() => {
    async function getGraph(): Promise<void> {
      try {
        const edges: Array<Edge> = (await axios.get("/api/edges"))
          .data as Array<Edge>;
        const nodes: Array<Node> = (await axios.get("/api/nodes"))
          .data as Array<Node>;
        const graph: GraphFrontend = new GraphFrontend();
        graph.populateGraph(nodes, edges);
        setGraph(graph);
      } catch (error) {
        console.error("Failed to fetch nodes data:", error);
      }
    }

    getGraph();
  }, [setGraph, showNodes]);

  const ref = useRef<HTMLImageElement | null>(null);
  const [divWidth, setWidth] = useState(0);
  const [divHeight, setHeight] = useState(0);
  const isImageLoaded = useRef(false);
  const loadImageOnce = useRef(0);

  /* const [isSaved, setIsSaved] = useState<boolean>(false);*/

  const [showModal, setShowModal] = useState<boolean>(false);

  const [newNode, setNewNode] = useState<Node>(
    new Node("", 0, 0, currentFloor, BuildingType.BTM, NodeType.HALL, "", ""),
  );

  const IMAGE_DIMENSIONS = useMemo(() => ({ width: 5000, height: 3400 }), []);
  const scaling = useMemo(
    () =>
      getScaling(
        divWidth,
        divHeight,
        IMAGE_DIMENSIONS.width,
        IMAGE_DIMENSIONS.height,
      ),
    [IMAGE_DIMENSIONS, divWidth, divHeight],
  );

  const [isHoldingShift, setIsHoldingShift] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startMousePosition, setStartMousePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [boxDimensions, setBoxDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [startMousePositionBox, setStartMousePositionBox] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (isHoldingShift) {
        console.log("mouse down");
        setSelectedNodes(new Array<string>());
        setIsMouseDown(true); // Set mouse down state to true
        setDisableZoomPanning(true);
        const { imageX, imageY } = displayToImageCoordinates(
          event.clientX,
          event.clientY,
          translationX,
          translationY,
          scale,
          scaling.widthScaling,
          scaling.heightScaling,
        );
        setStartMousePosition({ x: imageX, y: imageY });
        setStartMousePositionBox({ x: event.clientX, y: event.clientY });
      }
    },
    [
      setSelectedNodes,
      isHoldingShift,
      setIsMouseDown, // Make sure to include this setter in the dependencies
      setDisableZoomPanning,
      translationX,
      translationY,
      scale,
      scaling.widthScaling,
      scaling.heightScaling,
      setStartMousePosition,
      setStartMousePositionBox,
    ],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (isMouseDown) {
        console.log("mouse up");
        setIsMouseDown(false); // Reset mouse down state to false
        setDisableZoomPanning(false);
        const { imageX, imageY } = displayToImageCoordinates(
          event.clientX,
          event.clientY,
          translationX,
          translationY,
          scale,
          scaling.widthScaling,
          scaling.heightScaling,
        );
        setBoxDimensions({
          width: event.clientX - startMousePositionBox.x,
          height: event.clientY - startMousePositionBox.y,
        });
        if (graph) {
          const selectedNodes: Array<string> = graph.getNodesInRange(
            startMousePosition.x,
            startMousePosition.y,
            imageX,
            imageY,
          );
          setSelectedNodes(selectedNodes);
        }
      }
    },
    [
      startMousePositionBox,
      isMouseDown,
      setIsMouseDown, // Include this setter in the dependencies
      setDisableZoomPanning,
      translationX,
      translationY,
      scale,
      scaling.widthScaling,
      scaling.heightScaling,
      startMousePosition,
      graph,
      setSelectedNodes,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Shift") setIsHoldingShift(true);
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Shift") setIsHoldingShift(false);
    });

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Shift") setIsHoldingShift(true);
      });
      document.removeEventListener("keyup", (e) => {
        if (e.key === "Shift") setIsHoldingShift(false);
      });

      // Remove mouse event listeners
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseDown, handleMouseUp]);

  const resetNewNode = useCallback(() => {
    setNewNode(
      new Node(
        "",
        0,
        0,
        currentFloor,
        BuildingType.Francis45,
        NodeType.HALL,
        "",
        "",
      ),
    );
  }, [currentFloor]);

  useEffect(() => {
    resetNewNode();
  }, [resetNewNode]);

  const updateDimensions = useCallback(() => {
    if (ref.current && !isImageLoaded.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);
      isImageLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (loadImageOnce.current === 0) {
      loadImageOnce.current++;
      updateDimensions();
      isImageLoaded.current = false;
    } else {
      //console.log("here");
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [scale, updateDimensions]);

  // I optimized the image loading
  useEffect(() => {
    const imageUrls = buildingMap
      .getFloorMaps()
      .map((floorMap) => floorMap.getPngPath());
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  });

  const handleImageLoad = () => {
    if (!isImageLoaded.current) {
      updateDimensions();
    }
  };

  const handleAddNodeChange = (
    event: SelectChangeEvent<BuildingType> | SelectChangeEvent<NodeType>,
  ) => {
    const { name, value } = event.target;

    setNewNode((prev) => {
      if (!prev) {
        return newNode;
      }

      return new Node(
        prev.ID,
        prev.x,
        prev.y,
        prev.floor,
        name === "building" ? (value as BuildingType) : prev.building,
        name === "type" ? (value as NodeType) : prev.type,
        prev.longName,
        prev.shortName,
      );
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setNewNode((prev) => {
      if (!prev) {
        return newNode;
      }

      return new Node(
        name === "ID" ? value : prev.ID,
        prev.x,
        prev.y,
        prev.floor,
        prev.building,
        prev.type,
        name === "longName" ? value : prev.longName,
        name === "shortName" ? value : prev.shortName,
      );
    });
  };

  const handleAddNodeSave = () => {
    setShowModal(false);
    if (graph) {
      console.log(newNode);
      setGraph(graph.addNode(makeNode(newNode)));
    }
    setNodesToBeAdded([...nodesToBeAdded, makeNode(newNode)]);
    setUnsavedChanges(true);
    resetNewNode();
  };

  const handleAddNodeClose = () => {
    setShowModal(false);
    resetNewNode();
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

  /*   useEffect(() => {
        if (isSaved) {
            if (graph) {
                setGraph(graph.addNode(makeNode(newNode)));
            }
            setIsSaved(false);
            setUnsavedChanges(true);
        }
    }, [graph, setGraph, isSaved, newNode, setUnsavedChanges]);*/

  function nodeDisplayProps(node: Node): NodeDisplayProps {
    return {
      node: node,
      key: node.ID,
      scaling: scaling,
    };
  }

  function edgeDisplayProps(edge: Edge): EdgeDisplayProps {
    return {
      edge: edge,
      key: edge.ID,
      scaling: scaling,
    };
  }

  function pathDisplayProps(): PathDisplayProps {
    return {
      scaling: scaling,
    };
  }

  const divStyleBig: CSSProperties = {
    position: "relative",
    overflow: "visible",
  };

  const imgStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    zIndex: "1",
  };

  const svgStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 10,
    pointerEvents: "none",
  };

  const buildingOptions = [
    ...Object.entries(BuildingType).map(([key, value]) => ({
      label: key,
      value: value,
    })),
  ];

  const nodeTypeOptions = [
    ...Object.entries(NodeType).map(([key, value]) => ({
      label: key,
      value: value,
    })),
  ];

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setDisableZoomPanning(true);
    if (!showModal) {
      const { imageX, imageY } = displayToImageCoordinates(
        event.clientX,
        event.clientY,
        translationX,
        translationY,
        scale,
        scaling.widthScaling,
        scaling.heightScaling,
      );

      const addedNode: Node = new Node(
        newNode.ID,
        imageX, //widthScaling,
        imageY, //heightScaling,
        newNode.floor,
        newNode.building,
        newNode.type,
        newNode.longName,
        newNode.shortName,
      );
      setNewNode(addedNode);
      setShowModal(true);
    }
    setDisableZoomPanning(false);
  };

  const selectionBoxProps: SelectionBoxProps = {
    startMousePosition: startMousePosition,
    dimensions: boxDimensions,
    scaling: scaling,
  };

  if (editorMode === EditorMode.addNodes) {
    return (
      <div>
        <Dialog open={showModal} onClose={handleAddNodeClose}>
          <DialogTitle>Add New Node</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="ID"
              type="text"
              fullWidth
              name="ID"
              value={newNode.ID as string}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="X-Coordinate"
              type="text"
              fullWidth
              name="x"
              value={newNode.x as number}
            />
            <TextField
              margin="dense"
              label="Y-Coordinate"
              type="text"
              fullWidth
              name="y"
              value={newNode.y as number}
            />
            <TextField
              margin="dense"
              label="Floor"
              type="text"
              fullWidth
              name="floor"
              value={newNode.floor as FloorType}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="building-label">Building</InputLabel>
              <Select
                labelId="building-label"
                name="building"
                value={newNode.building as BuildingType}
                label="Building"
                onChange={handleAddNodeChange}
              >
                {buildingOptions.map((option) => (
                  <MenuItem
                    key={option.value as BuildingType}
                    value={option.value as BuildingType}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={newNode.type as NodeType}
                label="Type"
                onChange={handleAddNodeChange}
              >
                {nodeTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value as NodeType}
                    value={option.value as NodeType}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Long Name"
              type="text"
              fullWidth
              name="longName"
              value={newNode.longName as string}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Short Name"
              type="text"
              fullWidth
              name="shortName"
              value={newNode.shortName as string}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddNodeSave}>Save</Button>
          </DialogActions>
        </Dialog>
        <div style={divStyleBig} onClick={handleOnClick}>
          <img
            ref={ref}
            style={imgStyle}
            src={buildingMap.getFloorMap(currentFloor).getPngPath()}
            alt={"Error"}
            onLoad={handleImageLoad}
          ></img>
          {graph
            ? graph
                .getNodesByFloor(currentFloor)
                .map((node) => <NodeDisplay {...nodeDisplayProps(node)} />)
            : null}
          <svg
            style={svgStyle}
            onClick={() => {
              console.log("adios");
            }}
          >
            {graph
              ? graph
                  .getEdgesByFloorAll(currentFloor)
                  .map((edge) => <EdgeDisplay {...edgeDisplayProps(edge)} />)
              : null}
          </svg>
          <PathDisplay {...pathDisplayProps()} />
        </div>
      </div>
    );
  }

  return (
    <div style={divStyleBig}>
      <img
        ref={ref}
        style={imgStyle}
        src={buildingMap.getFloorMap(currentFloor).getPngPath()}
        alt={"Error"}
        onLoad={handleImageLoad}
      ></img>
      {graph
        ? graph
            .getNodesByFloor(currentFloor)
            .map((node) => <NodeDisplay {...nodeDisplayProps(node)} />)
        : null}
      <svg
        style={svgStyle}
        onClick={() => {
          console.log("adios");
        }}
      >
        {graph
          ? graph
              .getEdgesByFloorAll(currentFloor)
              .map((edge) => <EdgeDisplay {...edgeDisplayProps(edge)} />)
          : null}
      </svg>
      <PathDisplay {...pathDisplayProps()} />
      <SelectionBox {...selectionBoxProps}></SelectionBox>
    </div>
  );
}
