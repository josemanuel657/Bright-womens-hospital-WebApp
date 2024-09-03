import express, { Request, Response, Router } from "express";
import PrismaClient from "../bin/database-connection";
import { DeleteNodesOptionsRequest } from "common/src/types/map_page_types.ts";

const router: Router = express.Router();

router.delete("/", async function (req: Request, res: Response) {
  try {
    const { nodes } = req.body as DeleteNodesOptionsRequest;
    const nodeIds = nodes.map((node) => node.ID);

    const transaction = await PrismaClient.$transaction([
      PrismaClient.edge.deleteMany({
        where: {
          OR: [
            { startNodeID: { in: nodeIds } },
            { endNodeID: { in: nodeIds } },
          ],
        },
      }),
      PrismaClient.node.deleteMany({
        where: {
          nodeID: { in: nodeIds },
        },
      }),
    ]);

    res.status(200).json({
      message: "Nodes and associated edges deleted successfully",
      details: transaction,
    });
  } catch (error) {
    console.error("Failed to delete nodes and edges:", error);
    res.status(500).json({
      message: "Error deleting nodes and edges",
    });
  }
});

export default router;
