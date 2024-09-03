import express, { Request, Response, Router } from "express";
import {
  BuildingType,
  Edge,
  FloorType,
  Node,
  NodeType,
} from "common/src/DataStructures.ts";
import PrismaClient from "../bin/database-connection";
// import { EdgesByFloor } from "../../../../packages/common/src/types/map_page_types.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const frontEndEdges = new Array<Edge>();

  // get all the edges from the database
  const databaseEdges = await PrismaClient.edge.findMany();
  if (databaseEdges === null) {
    res.sendStatus(404);
    console.log("could not find the edges in the database");
  }

  for (const databaseEdge of databaseEdges) {
    // get the start Node Data
    const startNodeID: string = databaseEdge.startNodeID;
    const startNodeData = await PrismaClient.node.findUnique({
      where: {
        nodeID: startNodeID,
      },
    });
    if (startNodeData === null) {
      res.sendStatus(404);
      console.log("Could not find start node with ID: " + startNodeID);
      continue;
    }

    // get the endNode Data
    const endNodeID: string = databaseEdge.endNodeID;
    const endNodeData = await PrismaClient.node.findUnique({
      where: {
        nodeID: endNodeID,
      },
    });
    if (endNodeData === null) {
      res.sendStatus(404);
      console.log("Could not find start node with ID: " + startNodeID);
      continue;
    }

    // create the start node
    const startNode: Node = new Node(
      startNodeData.nodeID as string,
      startNodeData.xcoord as number,
      startNodeData.ycoord as number,
      startNodeData.floor as FloorType,
      startNodeData.building as BuildingType,
      startNodeData.nodeType as NodeType,
      startNodeData.longName as string,
      startNodeData.shortName as string,
    );

    // create the end node
    const endNode: Node = new Node(
      endNodeData.nodeID as string,
      endNodeData.xcoord as number,
      endNodeData.ycoord as number,
      endNodeData.floor as FloorType,
      endNodeData.building as BuildingType,
      endNodeData.nodeType as NodeType,
      endNodeData.longName as string,
      endNodeData.shortName as string,
    );

    // create the edge
    const frontEndEdge: Edge = new Edge(
      databaseEdge.edgeID,
      startNode,
      endNode,
    );
    frontEndEdges.push(frontEndEdge);
  }

  res.send(JSON.stringify(frontEndEdges));
});

export default router;
