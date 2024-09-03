import { Edge, Graph, Node, Path, Queue, Stack } from "../DataStructures.ts";
import { IPathFinder } from "../PathFinder.ts";

export class BFS implements IPathFinder {
  private readonly graph: Graph;
  constructor(graph: Graph) {
    this.graph = graph;
  }
  findPath(startNode: Node, endNode: Node): Path | undefined {
    const queue: Queue<Node> = new Queue<Node>();
    const visited: Set<Node> = new Set<Node>();
    const parentMap: Map<Node, Node> = new Map<Node, Node>();

    queue.enqueue(startNode);
    visited.add(startNode);

    while (!queue.isEmpty()) {
      const currentNode: Node | undefined = queue.dequeue();

      if (!currentNode) {
        continue;
      }

      if (currentNode === endNode) {
        break;
      }

      const edges: Array<Edge> =
        this.graph.getEdgesFromNode(currentNode) || new Array<Edge>();

      for (const edge of edges) {
        const nextNode: Node = edge.getEndNode();
        if (!visited.has(nextNode)) {
          queue.enqueue(nextNode);
          visited.add(nextNode);
          parentMap.set(nextNode, currentNode);
        }
      }
    }

    if (!visited.has(endNode)) {
      console.error("Path not found");
      return undefined;
    }

    const path: Stack<Edge> = new Stack<Edge>();
    let currentNode: Node = endNode;

    while (currentNode !== startNode) {
      const parent: Node | undefined = parentMap.get(currentNode);
      if (!parent) break;

      const edge: Edge | undefined = this.graph.getEdge(parent, currentNode);

      if (!edge) break;
      path.push(edge);
      currentNode = parent;
    }

    path.reverse();

    return new Path(path.toArray());
  }
}
