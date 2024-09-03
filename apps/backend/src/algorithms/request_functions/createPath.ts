import { Response } from "express";
import { StartEndNodes } from "../../../../../packages/common/src/types/map_page_types.ts";
import { Graph } from "common/src/data_structures/Graph.ts";
import { ASTAR } from "common/src/path_finding/ASTAR.ts";
import { Path } from "common/src/data_structures/Path.ts";
import { BFS } from "common/src/path_finding/BFS.ts";
import { DFS } from "common/src/path_finding/DFS.ts";
import { Dijkstra } from "common/src/path_finding/Dijkstra.ts";
import { AlgorithmType } from "common/src/data_structures/AlgorithmType.ts";
import { Strategy } from "common/src/path_finding/Strategy.ts";

export { createPath };
async function createPath(
  res: Response,
  algorithm: AlgorithmType,
  graph: Graph,
  startEndNodes: StartEndNodes,
): Promise<Path | undefined> {
  const { node1ID, node2ID } = startEndNodes;

  const startNode = graph.getNodeByID(node1ID);
  const endNode = graph.getNodeByID(node2ID);

  const strategy: Strategy = new Strategy(new ASTAR(graph));

  switch (algorithm) {
    case AlgorithmType._BFS:
      strategy.setStrategy(new BFS(graph));
      break;
    case AlgorithmType._DFS:
      strategy.setStrategy(new DFS(graph));
      break;
    case AlgorithmType._Dijkstra:
      strategy.setStrategy(new Dijkstra(graph));
      break;
    case AlgorithmType._ASTAR:
      strategy.setStrategy(new ASTAR(graph));
      break;
    default:
      strategy.setStrategy(new ASTAR(graph));
      break;
  }

  if (startNode !== undefined && endNode !== undefined) {
    const path: Path | undefined = strategy.findPath(startNode, endNode);

    if (!path) {
      console.log("Could not find the path");
      res.sendStatus(404);
      return undefined;
    }

    return path;
  }

  return undefined;
}
