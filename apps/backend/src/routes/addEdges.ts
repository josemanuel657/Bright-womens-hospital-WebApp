import express, { Request, Response, Router } from "express";
import PrismaClient from "../bin/database-connection";
import { AddEdgesOptionsRequest } from "common/src/types/map_page_types.ts";
import { Edge } from "common/src/DataStructures.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    const { newEdges } = req.body as AddEdgesOptionsRequest;

    // Check that the nodes that the edges are referencing exist
    const nodeIds = new Set(
      newEdges.flatMap((edge) => [edge.startNode.ID, edge.endNode.ID]),
    );
    const nodes = await PrismaClient.node.findMany({
      where: {
        nodeID: { in: Array.from(nodeIds) },
      },
      select: { nodeID: true },
    });

    if (nodes.length !== nodeIds.size) {
      console.log(
        "One or more nodes referenced by one ore more edges do not exist",
      );
      return res.status(404).json({
        message:
          "One or more nodes referenced by one ore more edges do not exist",
      });
    }

    // check that the added edges do not already exist:
    // not same ID, not same start and endNode, not same endNode startNode
    const existingEdges = await PrismaClient.edge.findMany({
      where: {
        OR: newEdges.map((edge) => ({
          OR: [
            {
              AND: [
                { startNodeID: edge.startNode.ID },
                { endNodeID: edge.endNode.ID },
              ],
            },
            {
              AND: [
                { startNodeID: edge.endNode.ID },
                { endNodeID: edge.startNode.ID },
              ],
            },
            { edgeID: edge.ID },
          ],
        })),
      },
    });
    if (existingEdges.length > 0) {
      console.log("Duplicated Edge Found");
      return res.status(400).json({
        message: "Duplicated Edge Found",
        wrongEdges: existingEdges,
      });
    }

    // Check that the new edge does not have the same start and end node
    if (newEdges.some((edge: Edge) => edge.startNode.ID === edge.endNode.ID)) {
      console.log("Edge with the same start and endNode");
      return res.status(400).json({
        message: "Edge with the same start and endNode",
      });
    }

    await PrismaClient.edge.createMany({
      data: newEdges.map((edge: Edge) => {
        return {
          edgeID: edge.ID,
          startNodeID: edge.startNode.ID,
          endNodeID: edge.endNode.ID,
        };
      }),
    });

    console.log("Nodes and edges added successfully");
    res.status(200).json({
      message: "Nodes and edges added successfully",
    });
  } catch (error) {
    console.error("Failed to add nodes and edges:", error);
    res.status(500).json({
      message: "Error adding nodes and edges",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
