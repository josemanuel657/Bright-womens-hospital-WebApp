import { Edge, FloorType, Node, NodeType } from "../DataStructures.ts";

export class Graph {
  private readonly adjList: Map<Node, Array<Edge>>;
  private readonly lookupTable: Map<string, Node>;

  public constructor() {
    this.adjList = new Map<Node, Array<Edge>>();
    this.lookupTable = new Map<string, Node>();
  }

  public getAdjList(): Map<Node, Array<Edge>> {
    return this.adjList;
  }
  public getLookupTable(): Map<string, Node> {
    return this.lookupTable;
  }

  public addEdge(ID: string, startNode: Node, endNode: Node): void {
    const edge: Edge = new Edge(ID, startNode, endNode);

    this.lookupTable.set(startNode.getID(), startNode);

    if (!this.adjList.has(startNode)) {
      this.adjList.set(startNode, []);
    }

    this.adjList.get(startNode)!.push(edge);
  }

  public addEdgeNoStairs(ID: string, startNode: Node, endNode: Node): void {
    const edge: Edge = new Edge(ID, startNode, endNode);
    if (edge.usesStairs()) {
      return;
    }

    this.lookupTable.set(startNode.getID(), startNode);

    if (!this.adjList.has(startNode)) {
      this.adjList.set(startNode, []);
    }

    this.adjList.get(startNode)!.push(edge);
  }

  public getEdgesFromNode(node: Node): Array<Edge> {
    const edges: Array<Edge> | undefined = this.adjList.get(node);
    if (edges !== undefined) {
      return edges;
    } else {
      console.log("No Edges");
      return new Array<Edge>();
    }
  }

  public getEdge(startNode: Node, endNode: Node): Edge | undefined {
    const edges: Array<Edge> | undefined = this.adjList.get(startNode);
    if (!edges) {
      console.error("Start node not found in the graph");
      return undefined;
    }
    for (const edge of edges) {
      if (edge.getEndNode() === endNode) {
        return edge;
      }
    }
    console.error("Edge not found between the specified nodes");
    return undefined;
  }

  public getNodeByID(id: string): Node | undefined {
    return this.lookupTable.get(id);
  }

  public getNodes(includeHallways: boolean): Array<Node> {
    if (includeHallways) {
      return this.getNodesAll();
    } else return this.getNodesNoHallways();
  }

  private getNodesNoHallways(): Array<Node> {
    return this.getNodesAll().filter(
      (node) => node.getType() !== NodeType.HALL,
    );
  }

  private getNodesAll(): Array<Node> {
    const nodes: Array<Node> = new Array<Node>();
    const keys: Array<Node> = Array.from(this.adjList.keys());
    for (const node of keys) {
      if (!nodes.map((node) => node.ID).includes(node.ID)) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  public getEdgesAll(): Array<Edge> {
    const edges: Array<Edge> = new Array<Edge>();
    const keys: Array<Node> = Array.from(this.adjList.keys());
    for (const node of keys) {
      const edgesFromNode: Array<Edge> = this.getEdgesFromNode(node);
      edgesFromNode.forEach((edge) => {
        if (!edges.map((edge) => edge.ID).includes(edge.ID)) {
          edges.push(edge);
        }
      });
    }
    return edges;
  }

  public getNodesByFloor(
    floorType: FloorType,
    includeHallways: boolean,
  ): Array<Node> {
    if (includeHallways) {
      return this.getNodesByFloorAll(floorType);
    } else return this.getNodesByFloorNoHallways(floorType);
  }

  private getNodesByFloorNoHallways(floorType: FloorType): Array<Node> {
    return this.getNodesByFloorAll(floorType).filter(
      (node) => node.getType() !== NodeType.HALL,
    );
  }

  private getNodesByFloorAll(floorType: FloorType): Array<Node> {
    const nodes: Array<Node> = new Array<Node>();
    const keys: Array<Node> = Array.from(this.adjList.keys());
    for (const node of keys) {
      if (node.getFloor() === floorType) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  public getEdgesByFloorAll(floorType: FloorType): Array<Edge> {
    const edges: Array<Edge> = new Array<Edge>();
    const keys: Array<Node> = Array.from(this.adjList.keys());
    for (const node of keys) {
      if (node.getFloor() === floorType) {
        const edgesFromNode: Array<Edge> = this.getEdgesFromNode(node);
        edgesFromNode.forEach((edge) => {
          if (!edges.map((edge) => edge.ID).includes(edge.ID)) {
            edges.push(edge);
          }
        });
      }
    }
    return edges;
  }
}
