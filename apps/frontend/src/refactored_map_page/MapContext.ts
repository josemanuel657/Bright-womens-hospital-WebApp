import { createContext, useContext } from "react";
import {
  FloorType,
  Node,
  Edge,
  AlgorithmType,
  Path,
} from "common/src/DataStructures.ts";
import {
  AccessibilityType,
  EditorMode,
  OldNewEdge,
} from "common/src/types/map_page_types.ts";
import { OldNewNode } from "common/src/types/map_page_types.ts";
import GraphFrontend from "./GraphFrontend.ts";

interface MapContextType {
  startNode: Node | null;
  endNode: Node | null;

  paths: Array<Path>;
  graph: GraphFrontend | null;

  startFloor: FloorType;
  endFloor: FloorType;

  currentFloor: FloorType;
  directionsCounter: number;

  selectedAlgorithm: AlgorithmType;
  selectedAccessibility: AccessibilityType;

  editorMode: EditorMode;
  showPaths: boolean;

  showNodes: boolean;
  showEdges: boolean;

  disableZoomPanning: boolean;
  scale: number;
  translationX: number;
  translationY: number;

  nodesToBeDeleted: Array<Node>;
  edgesToBeDeleted: Array<Edge>;
  nodesToBeEdited: Array<OldNewNode>;
  edgesToBeEdited: Array<OldNewEdge>;
  nodesToBeAdded: Array<Node>;
  edgesToBeAdded: Array<Edge>;

  unsavedChanges: boolean;

  edgeStartNode: Node | null;
  edgeEndNode: Node | null;

  selectedOption: string;
  //---------------------------------------
  setStartNode: (node: Node | null) => void;
  setEndNode: (node: Node | null) => void;

  setPaths: (paths: Array<Path>) => void;
  setGraph: (graph: GraphFrontend | null) => void;

  setStartFloor: (floor: FloorType) => void;
  setEndFloor: (floor: FloorType) => void;

  setCurrentFloor: (floor: FloorType) => void;
  setDirectionsCounter: (counter: number) => void;

  setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
  setSelectedAccessibility: (accessibility: AccessibilityType) => void;

  setEditorMode: (editorMode: EditorMode) => void;
  setShowPaths: (showPaths: boolean) => void;

  setShowNodes: (showNodes: boolean) => void;
  setShowEdges: (showEdges: boolean) => void;

  setDisableZoomPanning: (disableZoomPanning: boolean) => void;
  setScale: (scale: number) => void;
  setTranslationX: (translationX: number) => void;
  setTranslationY: (translationY: number) => void;

  setNodesToBeDeleted: (nodes: Array<Node>) => void;
  setEdgesToBeDeleted: (edges: Array<Edge>) => void;
  setNodesToBeEdited: (nodes: Array<OldNewNode>) => void;
  setEdgesToBeEdited: (edges: Array<OldNewEdge>) => void;
  setNodesToBeAdded: (nodes: Array<Node>) => void;
  setEdgesToBeAdded: (edges: Array<Edge>) => void;

  setUnsavedChanges: (hasChanged: boolean) => void;
  resetZoomingFunction: () => void;
  setResetZoomingFunction: (func: () => void) => void;

  setEdgeStartNode: (node: Node | null) => void;
  setEdgeEndNode: (node: Node | null) => void;

  setSelectedOption: (selectedOption: string) => void;

  selectedNodes: Array<string>;
  setSelectedNodes: (selectedNodes: Array<string>) => void;

  fixingEdges: boolean;
  setFixingEdges: (fixEdge: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);
function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
export default MapContext;
export type { MapContextType };
export { useMapContext };
