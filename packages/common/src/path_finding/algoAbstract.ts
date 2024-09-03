import { Edge, Graph, Node, Path } from "../DataStructures.ts";

export abstract class AlgoAbstract {
  protected graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  // Method to reconstruct the path using backtracking from the endNode
  protected reconstructPath(
    cameFrom: Map<Node, Node | null>,
    currentNode: Node,
  ): Path {
    const edges: Edge[] = [];
    while (cameFrom.has(currentNode)) {
      const prevNode = cameFrom.get(currentNode)!;
      const edge = this.graph.getEdge(prevNode, currentNode);
      if (edge) {
        edges.unshift(edge);
      }
      currentNode = prevNode;
    }
    return new Path(edges);
  }
}
