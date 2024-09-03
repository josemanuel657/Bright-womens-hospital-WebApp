import express, { Request, Response, Router } from "express";
import { Graph, Path } from "common/src/DataStructures";
import { createGraph } from "../algorithms/request_functions/createGraph";
import { PathOptionsRequest } from "../../../../packages/common/src/types/map_page_types";
import { createPath } from "../algorithms/request_functions/createPath.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const { algorithm, includeStairs, nodes, byFloors } =
    req.body as PathOptionsRequest;
  const graph: Graph = await createGraph(res, includeStairs);
  const path: Path | undefined = await createPath(res, algorithm, graph, nodes);

  if (path !== undefined) {
    if (!byFloors) {
      res.send(JSON.stringify(path));
    } else {
      res.send(JSON.stringify(path.getSubPathsByFloor()));
    }
  }
});

export default router;
