import { Edge, FloorType, Node } from "../DataStructures.ts";

export class Path {
  public edges: Array<Edge>;

  public constructor(edges: Array<Edge>) {
    this.edges = edges;
  }

  public getEdges(): Array<Edge> {
    return this.edges;
  }

  public getNumNodes(): number {
    return this.edges.length + 1;
  }

  public getNumEdges(): number {
    return this.edges.length;
  }

  public getPathDistance(): number {
    let pathDistance: number = 0;
    this.edges.forEach((edge: Edge) => {
      pathDistance += edge.getWeight();
    });
    return pathDistance;
  }

  public getNodes(): Array<Node> {
    const nodes: Array<Node> = new Array<Node>();
    for (const edge of this.edges) {
      nodes.push(edge.getStartNode());
    }
    nodes.push(this.getEndNode());
    return nodes;
  }

  public getStartEdge(): Edge {
    return this.edges[0];
  }

  public getEndEdge(): Edge {
    return this.edges[this.getNumEdges() - 1];
  }

  public getStartNode(): Node {
    return this.getStartEdge().getStartNode();
  }

  public getEndNode(): Node {
    return this.getEndEdge().getEndNode();
  }

  public getStartFloor(): FloorType {
    return this.getStartNode().getFloor();
  }

  public getEndFloor(): FloorType {
    return this.getEndNode().getFloor();
  }

  public getFloors(): Array<FloorType> {
    const floors: Array<FloorType> = new Array<FloorType>();
    const subPathsByFloor: Array<Path> = this.getSubPathsByFloor();
    for (const subPath of subPathsByFloor) {
      floors.push(subPath.getStartingFloor());
    }
    return floors;
  }

  public changesFloor(): boolean {
    const initialFloor: FloorType = this.getStartNode().getFloor();
    for (const edge of this.edges) {
      if (edge.getEndNode().getFloor() !== initialFloor) return true;
    }
    return false;
  }

  public getStartingFloor(): FloorType {
    return this.getStartNode().getFloor();
  }

  public getEdgesChangingFloor(): Array<Edge> {
    let currentFloor: FloorType = this.getStartingFloor();
    const edges: Array<Edge> = new Array<Edge>();

    for (const edge of this.edges) {
      const floor: FloorType = edge.getEndNode().getFloor();
      if (floor !== currentFloor) {
        edges.push(edge);
        currentFloor = floor;
      }
    }
    return edges;
  }

  public getNodesChangingFloor(): Array<Node> {
    const nodes: Array<Node> = new Array<Node>();
    const edges: Array<Edge> = this.getEdgesChangingFloor();
    for (const edge of edges) {
      const startNode: Node = edge.getStartNode();
      const endNode: Node = edge.getEndNode();
      if (!nodes.includes(startNode)) {
        nodes.push(startNode);
      }
      if (!nodes.includes(endNode)) {
        nodes.push(endNode);
      }
    }
    return nodes;
  }

  public getEdgeByIndex(index: number) {
    return this.edges[index];
  }

  public getSubPathsByFloor(): Array<Path> {
    const paths: Array<Path> = new Array<Path>();

    let currentFloorPath: Array<Edge> = new Array(this.getStartEdge());
    let currentFloor: FloorType = this.getStartingFloor();

    for (let i = 1; i < this.getNumEdges(); i++) {
      const edge: Edge = this.getEdgeByIndex(i);
      const floor: FloorType = edge.getStartNode().getFloor();
      if (floor !== currentFloor) {
        paths.push(new Path(currentFloorPath));
        currentFloorPath = new Array(edge);
        currentFloor = floor;
      } else {
        currentFloorPath.push(edge);
      }
    }

    paths.push(new Path(currentFloorPath));

    return paths;
  }
}
