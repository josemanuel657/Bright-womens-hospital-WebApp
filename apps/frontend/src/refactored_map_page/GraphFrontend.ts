import { Node } from "common/src/data_structures/Node.ts";
import { Edge } from "common/src/data_structures/Edge.ts";
import { FloorType } from "common/src/data_structures/FloorType.ts";
import { BuildingType } from "common/src/data_structures/BuildingType.ts";
import { NodeType } from "common/src/data_structures/NodeType.ts";

const createNewNode = (node: Node) => {
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
};

export default class GraphFrontend {
  public lookupTable: Map<string, Node>;
  public adjLists: Map<FloorType, Map<string, Array<Edge>>>;

  public constructor() {
    this.lookupTable = new Map<string, Node>();
    this.adjLists = new Map<FloorType, Map<string, Array<Edge>>>();
    const floorTypes: Array<FloorType> = [
      FloorType.L2,
      FloorType.L1,
      FloorType.first,
      FloorType.second,
      FloorType.third,
    ];
    floorTypes.forEach((floorType: FloorType) => {
      this.adjLists.set(floorType, new Map<string, Array<Edge>>());
    });
  }

  public getNodesInRange(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): Array<string> {
    const filteredIDs: Array<string> = new Array<string>();
    Array.from(this.lookupTable.keys()).forEach((ID: string) => {
      const node: Node | undefined = this.lookupTable.get(ID);
      if (node) {
        const inRangeX: boolean = node.x >= startX && node.x <= endX;
        const inRangeY: boolean = node.y >= startY && node.y <= endY;
        if (inRangeX && inRangeY) {
          filteredIDs.push(node.ID);
        }
      }
    });
    return filteredIDs;
  }

  public populateGraph(nodes: Array<Node>, edges: Array<Edge>) {
    for (const node of nodes) {
      this.addNode(
        new Node(
          node.ID as string,
          node.x as number,
          node.y as number,
          node.floor as FloorType,
          node.building as BuildingType,
          node.type as NodeType,
          node.longName as string,
          node.shortName as string,
        ),
      );
    }
    for (const edge of edges) {
      const startNode = new Node(
        edge.startNode.ID as string,
        edge.startNode.x as number,
        edge.startNode.y as number,
        edge.startNode.floor as FloorType,
        edge.startNode.building as BuildingType,
        edge.startNode.type as NodeType,
        edge.startNode.longName as string,
        edge.startNode.shortName as string,
      );

      const endNode = new Node(
        edge.endNode.ID as string,
        edge.endNode.x as number,
        edge.endNode.y as number,
        edge.endNode.floor as FloorType,
        edge.endNode.building as BuildingType,
        edge.endNode.type as NodeType,
        edge.endNode.longName as string,
        edge.endNode.shortName as string,
      );
      this.addEdge(edge.ID, startNode, endNode);
    }
  }

  public addNode(node: Node): GraphFrontend {
    if (this.lookupTable.has(node.ID)) {
      return this;
    }

    this.lookupTable.set(node.ID, node);
    this.adjLists.get(node.floor)?.set(node.ID, new Array<Edge>());

    console.log("added");
    return this;
  }

  public removeNode(nodeID: string): GraphFrontend {
    if (!this.lookupTable.has(nodeID)) {
      console.error("The graph does not contain such node");
      return this;
    }

    // Remove the node from the lookup table
    this.lookupTable.delete(nodeID);

    // Iterate through each floor's adjacency list
    this.adjLists.forEach((floorAdjList) => {
      // Remove the node directly from the floor's adjacency list if it exists
      if (floorAdjList.has(nodeID)) {
        floorAdjList.delete(nodeID);
      }

      // Iterate through all nodes in the current floor's adjacency list to remove any edges that connect to the deleted node
      floorAdjList.forEach((edges, currentNodeID) => {
        const filteredEdges = edges.filter(
          (edge) => edge.startNode.ID !== nodeID && edge.endNode.ID !== nodeID,
        );
        floorAdjList.set(currentNodeID, filteredEdges);
      });
    });

    return this;
  }

  public removeNodeFixing(nodeID: string): GraphFrontend {
    console.log("Removing node, fixing edges");
    if (!this.lookupTable.has(nodeID)) {
      console.error("The graph does not contain such node");
      return this;
    }

    // Remove the node from the lookup table
    this.lookupTable.delete(nodeID);

    // Store the nodes that are stranded
    const strandedNodes: Set<string> = new Set();

    // Iterate through each floor's adjacency list
    this.adjLists.forEach((floorAdjList) => {
      // Remove the node directly from the floor's adjacency list if it exists
      // Iterate through all nodes in the current floor's adjacency list to remove any edges that connect to the deleted node
      floorAdjList.forEach((edges, currentNodeID) => {
        const filteredEdges = edges.filter((edge) => {
          if (edge.startNode.ID === nodeID || edge.endNode.ID === nodeID) {
            console.log("found an edge to delete");
            console.log(edge.startNode.ID, edge.endNode.ID);
            const strandedNode =
              edge.startNode.ID === nodeID ? edge.endNode : edge.startNode;
            strandedNodes.add(strandedNode.ID);
            return false; // Edge is removed because it connects to the deleted node
          }
          return true;
        });
        floorAdjList.set(currentNodeID, filteredEdges);
      });
      floorAdjList.delete(nodeID);

      // Check and add edges between stranded nodes if they do not already exist
    });
    console.log("Stranded nodes:", Array.from(strandedNodes));

    strandedNodes.forEach((nodeID) => {
      const node = this.lookupTable.get(nodeID);
      if (node) {
        strandedNodes.forEach((otherNodeID) => {
          const otherNode = this.lookupTable.get(otherNodeID);
          if (otherNode) {
            if (
              node !== otherNode &&
              !this.edgeExists(node.ID, otherNode.ID, node.floor)
            ) {
              console.log("Adding edge between:", node.ID, "and", otherNode.ID);
              this.addEdge(node.ID + otherNode.ID, node, otherNode);
            }
          }
        });
      }
    });

    return this;
  }

  private edgeExists(
    startNodeID: string,
    endNodeID: string,
    floor: FloorType,
  ): boolean {
    return (
      this.adjLists
        .get(floor)
        ?.get(startNodeID)
        ?.some(
          (edge) =>
            edge.startNode.ID === endNodeID || edge.endNode.ID === startNodeID,
        ) ?? false
    );
  }

  public editNode(editedNode: Node): GraphFrontend {
    // First, check if the node exists in the lookup table
    if (!this.lookupTable.has(editedNode.ID)) {
      console.error("Node to edit does not exist");
      return this;
    }

    // Create a new node instance based on the edited properties
    const newNode = createNewNode(editedNode);

    // Update the node in the lookup table
    this.lookupTable.set(newNode.ID, newNode);

    // Clone the adjacency lists to ensure we are not modifying the existing references
    const newAdjLists = new Map<FloorType, Map<string, Array<Edge>>>();

    // Iterate through each floor and update the adjacency lists
    this.adjLists.forEach((map, floor) => {
      const newMap = new Map<string, Array<Edge>>();
      map.forEach((edges, nodeID) => {
        // Create a new array for edges to replace references with updated node info
        const newEdges = edges.map((edge) => {
          if (edge.startNode.ID === newNode.ID) {
            return new Edge(edge.ID, newNode, edge.endNode); // Update start node
          } else if (edge.endNode.ID === newNode.ID) {
            return new Edge(edge.ID, edge.startNode, newNode); // Update end node
          }
          return edge; // No change for other edges
        });
        newMap.set(nodeID, newEdges);
      });
      newAdjLists.set(floor, newMap);
    });

    // Update the current GraphFrontend instance's properties
    this.lookupTable = new Map<string, Node>(this.lookupTable);
    this.adjLists = newAdjLists;

    return this;
  }

  public editNodes(nodeIDs: Array<string>, deltaX: number, deltaY: number) {
    nodeIDs.forEach((nodeID: string) => {
      const node: Node | undefined = this.lookupTable.get(nodeID);
      if (node) {
        const newNode: Node = new Node(
          node.ID,
          node.x + deltaX,
          node.y + deltaY, //heightScaling,
          node.floor,
          node.building,
          node.type,
          node.longName,
          node.shortName,
        );
        this.editNode(newNode);
      }
    });
    return this;
  }

  public addEdge(ID: string, startNode: Node, endNode: Node): GraphFrontend {
    const edgeID = startNode.ID + endNode.ID;
    const edge = new Edge(edgeID, startNode, endNode);
    // Check if both nodes exist in the lookup table before adding an edge
    if (!this.lookupTable.has(edge.startNode.ID)) {
      this.addNode(edge.startNode);
    }

    if (!this.lookupTable.has(edge.endNode.ID)) {
      this.addNode(edge.endNode);
    }

    // Helper function to add an edge to the floor's adjacency list
    const addEdgeToFloor = (
      nodeID: string,
      edge: Edge,
      floor: FloorType,
    ): void => {
      const alreadyContainsThatEdge = this.adjLists
        .get(floor)
        ?.get(nodeID)
        ?.some(
          (currentEdge) =>
            (edge.startNode.ID === currentEdge.startNode.ID &&
              edge.endNode.ID === currentEdge.endNode.ID) ||
            (edge.startNode.ID === currentEdge.endNode.ID &&
              edge.endNode.ID === currentEdge.startNode.ID),
        );
      if (alreadyContainsThatEdge) {
        console.log("That edge already exists");
        return;
      }
      this.adjLists.get(floor)?.get(nodeID)?.push(edge);
    };

    // Determine the floors of the start and end nodes
    const startFloor = edge.startNode.floor;
    const endFloor = edge.endNode.floor;

    // Add edge to the floor's adjacency list of the start node
    addEdgeToFloor(edge.startNode.ID, edge, startFloor);
    // If the edge spans floors, add it to the end node's floor as well
    if (startFloor !== endFloor) {
      addEdgeToFloor(edge.endNode.ID, edge, endFloor);
    }

    return this;
  }

  public removeEdge(edge: Edge): GraphFrontend {
    // Check if both nodes exist in the lookup table before attempting to remove an edge
    if (
      !this.lookupTable.has(edge.startNode.ID) ||
      !this.lookupTable.has(edge.endNode.ID)
    ) {
      console.error(
        "One or both nodes do not exist in the graph, cannot remove edge",
      );
      return this;
    }

    // Helper function to remove an edge from the floor's adjacency list for both connected nodes
    const removeEdgeFromFloor = (edge: Edge, floor: FloorType) => {
      const floorAdjList = this.adjLists.get(floor);
      if (!floorAdjList) return;

      [edge.startNode.ID, edge.endNode.ID].forEach((nodeID) => {
        const edges = floorAdjList.get(nodeID);
        if (edges) {
          const filteredEdges = edges.filter(
            (e) =>
              !(
                e.startNode.ID === edge.startNode.ID &&
                e.endNode.ID === edge.endNode.ID
              ) &&
              !(
                e.startNode.ID === edge.endNode.ID &&
                e.endNode.ID === edge.startNode.ID
              ),
          );
          floorAdjList.set(nodeID, filteredEdges);
        }
      });
    };

    // Determine the floors of the start and end nodes
    const startFloor = edge.startNode.floor;
    const endFloor = edge.endNode.floor;

    // Remove the edge from the adjacency list of the start node's floor
    removeEdgeFromFloor(edge, startFloor);

    // If the edge spans different floors, remove it from the end node's floor as well
    if (startFloor !== endFloor) {
      removeEdgeFromFloor(edge, endFloor);
    }

    return this;
  }

  public editEdge(oldEdge: Edge, newEdge: Edge): GraphFrontend {
    this.removeEdge(oldEdge);
    this.addEdge(newEdge.ID, newEdge.startNode, newEdge.endNode);
    return this;
  }

  public getNodeByID(id: string): Node | undefined {
    return this.lookupTable.get(id);
  }

  public getNodesByFloor(floor: FloorType): Array<Node> {
    const floorMap = this.adjLists.get(floor);
    if (floorMap) {
      const nodes = new Array<Node>();
      Array.from(floorMap.keys()).forEach((nodeID) => {
        const node: Node | undefined = this.lookupTable.get(nodeID);
        if (node) {
          nodes.push(node);
        }
      });
      return nodes;
    } else {
      return new Array<Node>();
    }
  }

  public getNodesByFloorNoHallways(floorType: FloorType): Array<Node> {
    return this.getNodesByFloor(floorType).filter(
      (node) => node.type !== NodeType.HALL,
    );
  }

  public getNodesAll(): Array<Node> {
    const nodes = new Array<Node>();
    Array.from(this.adjLists.keys()).forEach((floorType: FloorType) => {
      const floorMap = this.adjLists.get(floorType);
      if (!floorMap) return;
      Array.from(floorMap.keys()).forEach((nodeID) => {
        const node: Node | undefined = this.lookupTable.get(nodeID);
        if (node) {
          nodes.push(node);
        }
      });
    });
    return nodes;
  }

  private getNodesAllNoHallways(): Array<Node> {
    return this.getNodesAll().filter((node) => node.type !== NodeType.HALL);
  }

  public getEdgesFromNode(node: Node): Array<Edge> {
    if (!this.lookupTable.has(node.ID)) {
      console.log("could not find the node");
      return new Array<Edge>();
    }
    const edges: Array<Edge> | undefined = this.adjLists
      .get(node.floor)
      ?.get(node.ID);
    if (edges !== undefined) {
      return edges;
    } else {
      console.log("No Edges");
      return new Array<Edge>();
    }
  }

  public getEdgesAll(): Array<Edge> {
    const edges: Array<Edge> = new Array<Edge>();
    for (const floor of this.adjLists.keys()) {
      edges.concat(this.getEdgesByFloorAll(floor));
    }
    return edges;
  }

  public getEdgesByFloorAll(floor: FloorType): Array<Edge> {
    const floorMap = this.adjLists.get(floor);
    if (floorMap) {
      const edges = new Array<Edge>();
      Array.from(floorMap.keys()).forEach((nodeID) => {
        floorMap.get(nodeID)?.forEach((edge) => {
          edges.push(edge);
        });
      });
      return edges;
    } else {
      return new Array<Edge>();
    }
  }
}
