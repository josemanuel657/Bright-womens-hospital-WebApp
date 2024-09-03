import express, { Request, Response, Router } from "express";
import PrismaClient from "../bin/database-connection";
import {
  OldNewNode,
  RefactorNodesOptionsRequest,
} from "common/src/types/map_page_types.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    console.log(req.body);
    const refactorNodesOptionsRequest = req.body as RefactorNodesOptionsRequest;
    const oldNewNodes: Array<OldNewNode> =
      refactorNodesOptionsRequest.oldNewNodes;

    console.log(oldNewNodes);

    // Check that the ID of the node has not been changed
    const changesID: boolean = oldNewNodes.some((oldNewNode) => {
      return oldNewNode.oldNode.ID !== oldNewNode.newNode.ID;
    });
    if (changesID) {
      console.log("You are not allowed to change the ID of the node");
      return res.status(400).json({
        message: "You are not allowed to change the ID of the node",
      });
    }

    // Check that the ID of the node we want to change exists
    // const nodeIDs = oldNewNodes.map((oldNewNode) => oldNewNode.oldNode.ID); // use oldNode.ID to check existence
    // const existingNodes = await PrismaClient.node.findMany({
    //   where: { nodeID: { in: nodeIDs } },
    // });
    // if (existingNodes.length !== oldNewNodes.length) {
    //   console.log("One or more node IDs could not be found");
    //   return res.status(400).json({
    //     message: "One or more node IDs could not be found",
    //   });
    // }

    // Prepare update operations
    const updateOperations = oldNewNodes.map(({ newNode }) =>
      PrismaClient.node.update({
        where: { nodeID: newNode.ID },
        data: {
          xcoord: Math.floor(newNode.x),
          ycoord: Math.floor(newNode.y),
          floor: newNode.floor,
          building: newNode.building,
          nodeType: newNode.type,
          longName: newNode.longName,
          shortName: newNode.shortName,
        },
      }),
    );

    // Execute all updates in a transaction
    await PrismaClient.$transaction(updateOperations);
    console.log("Nodes updated successfully");

    res.status(200).json({
      message: "Nodes updated successfully",
    });
  } catch (error) {
    console.error("Failed to update nodes:", error);
    res.status(500).json({
      message: "Error updating nodes",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
