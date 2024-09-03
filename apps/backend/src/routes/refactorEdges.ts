import express, { Request, Response, Router } from "express";
import PrismaClient from "../bin/database-connection";
import { RefactorEdgesOptionsRequest } from "common/src/types/map_page_types.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    const { oldNewEdges } = req.body as RefactorEdgesOptionsRequest;

    oldNewEdges.forEach((oldNewEdge) => {
      console.log(oldNewEdge.oldEdge.ID);
      console.log(oldNewEdge.newEdge.ID);
      console.log(oldNewEdge.oldEdge.startNode);
      console.log(oldNewEdge.oldEdge.endNode);
      console.log(oldNewEdge.newEdge.startNode);
      console.log(oldNewEdge.newEdge.endNode);
    });

    // Validate that edge IDs have not been changed
    const changesID = oldNewEdges.some(
      ({ oldEdge, newEdge }) => oldEdge.ID !== newEdge.ID,
    );
    if (changesID) {
      console.log(
        "Edge ID changes detected:",
        oldNewEdges.filter(({ oldEdge, newEdge }) => oldEdge.ID !== newEdge.ID),
      );
      return res.status(400).json({
        message: "You are not allowed to change the ID of an edge",
      });
    }

    // Collect all old edge IDs
    const edgeIDs = oldNewEdges.map(({ oldEdge }) => oldEdge.ID);
    console.log("Checking for existing edge IDs:", edgeIDs);

    // Check existence of these edge IDs in the database
    const existingEdges = await PrismaClient.edge.findMany({
      where: { edgeID: { in: edgeIDs } },
    });
    console.log("Existing edges found:", existingEdges);

    if (existingEdges.length !== edgeIDs.length) {
      console.log(
        "Not all edges were found, expected:",
        oldNewEdges.length,
        "found:",
        existingEdges.length,
      );
      return res.status(404).json({
        message: "One or more edges could not be found",
      });
    }

    // Check that the referenced nodes exist
    const nodeIDs = oldNewEdges.flatMap(({ newEdge, oldEdge }) => [
      oldEdge.startNode.ID,
      oldEdge.endNode.ID,
      newEdge.startNode.ID,
      newEdge.endNode.ID,
    ]);
    const nodes = await PrismaClient.node.findMany({
      where: { nodeID: { in: nodeIDs } },
      select: { nodeID: true },
    });
    console.log("Nodes involved:", nodes);

    if (nodes.length !== new Set(nodeIDs).size) {
      console.log(
        "Node mismatch, expected nodes:",
        new Set(nodeIDs).size,
        "found:",
        nodes.length,
      );
      return res.status(404).json({
        message: "One or more nodes do not exist",
      });
    }

    // Check that the refactored edges do not have the same start and end node
    if (
      oldNewEdges.some(
        ({ newEdge }) => newEdge.startNode.ID === newEdge.endNode.ID,
      )
    ) {
      console.log(
        "Invalid edge with the same start and end node detected:",
        oldNewEdges.filter(
          ({ newEdge }) => newEdge.startNode.ID === newEdge.endNode.ID,
        ),
      );
      return res.status(400).json({
        message: "Edge with the same start and end node is not allowed",
      });
    }

    // Prepare update operations
    const updateOperations = oldNewEdges.map(({ oldEdge, newEdge }) =>
      PrismaClient.edge.update({
        where: { edgeID: oldEdge.ID }, // Use oldEdge ID to ensure correct edge is updated
        data: {
          startNodeID: newEdge.startNode.ID, // New start node ID
          endNodeID: newEdge.endNode.ID, // New end node ID
        },
      }),
    );

    // Execute all updates in a transaction
    await PrismaClient.$transaction(updateOperations);
    console.log("Update operations completed successfully");

    res.status(200).json({
      message: "Edges updated successfully",
    });
  } catch (error) {
    console.log("Failed to update edges:", error);
    res.status(500).json({
      message: "Error updating edges",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
