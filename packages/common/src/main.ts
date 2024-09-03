import { Graph, Node, Path } from "./DataStructures.ts";
import { BFS, IPathFinder } from "./PathFinder.ts";

function main(): void {
  // Select the path to the csv with the nodes and edges
  // Create a graph and populate it with the csv nodes and edges
  const graph: Graph = new Graph();

  // instantiate the path finding algorithm class (BFS, DFS, Djistras, Astar)
  const bfsPathFinder: IPathFinder = new BFS(graph);

  // Choose the start and endNode that you want (Select the ID)
  const startNodeID: string = "ACONF00102";
  const endNodeID: string = "BHALL02602";

  // Get the start and end nodes with the ID's
  const startNode: Node | undefined = graph.getNodeByID(startNodeID);
  const endNode: Node | undefined = graph.getNodeByID(endNodeID);

  // Check that those nodes exist
  if (!startNode || !endNode) {
    console.error("Start or end node not found");
    return;
  }

  // Find the path between the two nodes
  const path: Path | undefined = bfsPathFinder.findPath(startNode, endNode);

  // Check that the path exist
  if (!path) {
    console.error("Path not found");
    return;
  }

  // log the path to the terminal
  console.log(path);
}

main();
