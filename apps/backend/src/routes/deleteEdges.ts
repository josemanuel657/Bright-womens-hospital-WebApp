import express, { Request, Response, Router } from "express";
import PrismaClient from "../bin/database-connection";
import { DeleteEdgesOptionsRequest } from "common/src/types/map_page_types.ts";

const router: Router = express.Router();

router.delete("/", async function (req: Request, res: Response) {
  try {
    const { edges } = req.body as DeleteEdgesOptionsRequest;

    const deleteOperations = edges.map((edge) =>
      PrismaClient.edge.deleteMany({
        where: {
          edgeID: edge.ID,
          startNodeID: edge.startNode.ID,
          endNodeID: edge.endNode.ID,
        },
      }),
    );

    const transaction = await PrismaClient.$transaction(deleteOperations);

    res.status(200).json({
      message: "Requested edges deleted successfully",
      details: transaction,
    });
  } catch (error) {
    console.error("Failed to delete edges:", error);
    res.status(500).json({
      message: "Error deleting edges",
    });
  }
});

export default router;
