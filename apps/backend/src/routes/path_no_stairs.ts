import express, { Request, Response, Router } from "express";
import { Graph, Path } from "common/src/DataStructures";
import { createGraph } from "../algorithms/request_functions/createGraph";
import { StartEndNodes } from "../../../../packages/common/src/types/map_page_types";
import { ASTAR } from "common/src/PathFinder.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const graph: Graph = await createGraph(res, true);

  const { node1ID, node2ID } = req.body as StartEndNodes;

  const startNode = graph.getNodeByID(node1ID);
  const endNode = graph.getNodeByID(node2ID);

  const bfs: ASTAR = new ASTAR(graph);

  if (startNode !== undefined && endNode !== undefined) {
    const path: Path | undefined = bfs.findPath(startNode, endNode);
    const paths: Array<Path> | undefined = path?.getSubPathsByFloor();

    if (!path) {
      console.log("Could not find the path");
      res.sendStatus(404);
    }
    res.send(JSON.stringify(paths));
  }
});

export default router;
