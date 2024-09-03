import { Node, Path } from "../DataStructures.ts";
import { IPathFinder } from "../PathFinder.ts";
import { AlgoAbstract } from "./algoAbstract.ts";
import { PriorityQueue } from "../data_structures/PriorityQueue.ts";

export class Dijkstra extends AlgoAbstract implements IPathFinder {
  findPath(startNode: Node, endNode: Node): Path | undefined {
    const distances = new Map<Node, number>();
    const previous = new Map<Node, Node | null>();
    const openSet = new PriorityQueue<Node>();

    this.graph.getNodes(true).forEach((node) => {
      distances.set(node, node === startNode ? 0 : Infinity);
      previous.set(node, null);
    });

    openSet.enqueue(0, startNode);

    while (!openSet.isEmpty()) {
      const currentNode = openSet.dequeue();

      if (currentNode === endNode) {
        break;
      }

      const neighbors = this.graph.getEdgesFromNode(currentNode!);
      neighbors.forEach((edge) => {
        const neighbor = edge.getEndNode();
        const newDistance = distances.get(currentNode!)! + edge.getWeight();
        if (newDistance < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, currentNode!);
          openSet.enqueue(newDistance, neighbor);
        }
      });
    }
    if (previous !== null) {
      return previous.has(endNode)
        ? this.reconstructPath(previous, endNode)
        : undefined;
    }
  }
}
