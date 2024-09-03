import { Edge, Graph, Node, Path } from "../DataStructures.ts";
import { IPathFinder } from "../PathFinder.ts";

export class DFS implements IPathFinder {
  graph: Graph;
  visited: Set<Node>;

  constructor(graph: Graph) {
    this.graph = graph;
    this.visited = new Set<Node>();
  }

  findPath(startNode: Node, endNode: Node): Path | undefined {
    if (!startNode) {
      console.error("Start Node is not valid.");
      return undefined;
    }

    const result: Node[] = [];
    if (!this.dfsRecursive(startNode, result, endNode)) {
      console.error("End node not reachable from start node.");
      return undefined;
    }

    const pathEdges: Edge[] = [];
    for (let i = 0; i < result.length - 1; i++) {
      const startNode = result[i];
      const endNode = result[i + 1];
      const edge = this.graph.getEdge(startNode, endNode);

      if (!edge) {
        console.error("Edge not found between two nodes. Aborting.");
        return undefined;
      }
      pathEdges.push(edge);
    }
    return new Path(pathEdges);
  }

  private dfsRecursive(node: Node, result: Node[], endNode: Node): boolean {
    this.visited.add(node);
    result.push(node);

    if (node === endNode) {
      return true;
    }

    const neighbours = this.graph.getEdgesFromNode(node);
    if (neighbours) {
      for (const edge of neighbours) {
        const neighbour = edge.getEndNode();
        if (!this.visited.has(neighbour)) {
          if (this.dfsRecursive(neighbour, result, endNode)) {
            return true;
          }
        }
      }
    }
    result.pop(); // Remove the current node from the path if it leads to no solution
    return false;
  }
}
