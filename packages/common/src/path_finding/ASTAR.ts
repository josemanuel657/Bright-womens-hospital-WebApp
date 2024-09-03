import { Graph, Node, Path } from "../DataStructures.ts";
import { IPathFinder } from "../PathFinder.ts";
import { AlgoAbstract } from "./algoAbstract.ts";
import { PriorityQueue } from "../data_structures/PriorityQueue.ts";

export class ASTAR extends AlgoAbstract implements IPathFinder {
  constructor(graph: Graph) {
    super(graph);
  }

  heuristicFunc(startNode: Node, endNode: Node): number {
    // Euclidean distance as the heuristic
    return Math.sqrt(
      Math.pow(endNode.getX() - startNode.getX(), 2) +
        Math.pow(endNode.getY() - startNode.getY(), 2),
    );
  }

  findPath(startNode: Node, endNode: Node): Path | undefined {
    const openSet = new PriorityQueue<Node>();
    const cameFrom = new Map<Node, Node>();
    const gScore = new Map<Node, number>();
    const fScore = new Map<Node, number>();

    gScore.set(startNode, 0);
    fScore.set(startNode, this.heuristicFunc(startNode, endNode));

    openSet.enqueue(0, startNode);

    while (!openSet.isEmpty()) {
      const currentNode = openSet.dequeue();
      if (currentNode === endNode) {
        return this.reconstructPath(cameFrom, endNode);
      }

      this.graph.getEdgesFromNode(currentNode!).forEach((edge) => {
        const neighbor = edge.getEndNode();
        const tentativeGScore = gScore.get(currentNode!)! + edge.getWeight();
        const tentativeFScore =
          tentativeGScore + this.heuristicFunc(neighbor, endNode);

        if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
          cameFrom.set(neighbor, currentNode!);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeFScore);
          openSet.enqueue(tentativeFScore, neighbor);
        }
      });
    }

    return undefined;
  }
}
