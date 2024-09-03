import express, { Request, Response, Router } from "express";
import {
  BuildingType,
  FloorType,
  Node,
  NodeType,
} from "common/src/DataStructures.ts";
import PrismaClient from "../bin/database-connection";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const nodesFrontEnd: Array<Node> = new Array<Node>();

  const databaseNodes = await PrismaClient.node.findMany();
  if (databaseNodes === null) {
    console.log("error with the database");
  } else if (databaseNodes.length === 0) {
    console.log("no dangling nodes in the database");
    res.send(JSON.stringify(new Array<Node>()));
  } else {
    for (const nodeDatabase of databaseNodes) {
      const nodeFrontEnd: Node = new Node(
        nodeDatabase.nodeID as string,
        nodeDatabase.xcoord as number,
        nodeDatabase.ycoord as number,
        nodeDatabase.floor as FloorType,
        nodeDatabase.building as BuildingType,
        nodeDatabase.nodeType as NodeType,
        nodeDatabase.longName as string,
        nodeDatabase.shortName as string,
      );
      nodesFrontEnd.push(nodeFrontEnd);
    }
    res.send(JSON.stringify(nodesFrontEnd));
  }
});

export default router;
