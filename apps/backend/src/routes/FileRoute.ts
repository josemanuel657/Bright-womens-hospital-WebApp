import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// Whenever a get request is made, return the high score
router.get("/nodes", async function (req: Request, res: Response) {
  console.log("req");
  // Fetch the high score from Prisma
  let node;

  if (req.query.Floors) {
    const floors = (req.query.Floors as string).split(",");
    if (floors.length === 0) {
      node = await PrismaClient.node.findMany();
    } else {
      node = await PrismaClient.node.findMany({
        where: { floor: floors[0] },
      });
      for (let i = 1; i < floors.length; i++) {
        node = node.concat(
          await PrismaClient.node.findMany({ where: { floor: floors[i] } }),
        );
      }
    }
  } else {
    node = await PrismaClient.node.findMany();
  }

  // If the high score doesn't exist
  if (node === null) {
    // Log that (it's a problem)
    console.error("No nodes found in database!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(node);
  }
});

router.post("/nodes", async function (req: Request, res: Response) {
  console.log("req");
  console.log(req.body.deleteAll);
  if (req.body.deleteAll) {
    try {
      await PrismaClient.node.deleteMany({});
      console.log("Successfully wiped Nodes");
    } catch (error) {
      console.error("Unable to wipe Nodes");
      res.sendStatus(204);
      return;
    }
  }
  const requestAttempt: Prisma.NodeCreateManyInput = req.body.nodes;

  try {
    await PrismaClient.node.createMany({ data: requestAttempt });
    console.log("Successfully created Nodes");
  } catch (error) {
    console.error("Unable to create Nodes");
    console.log(error);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.delete("/nodes", async function (req: Request, res: Response) {
  console.log("req");
  console.log(req.body.deleteAll);
  console.log(req.body.deleteIDs);

  if (req.body.deleteAll === "true") {
    try {
      await PrismaClient.node.deleteMany({});
      console.log("Successfully wiped all Nodes");
      res.sendStatus(200);
      return;
    } catch (error) {
      console.error("Unable to wipe all Nodes");
      res.sendStatus(204);
      return;
    }
  }

  for (let i = 0; i < req.body.deleteIDs.length; i++) {
    try {
      await PrismaClient.node.delete({
        where: { nodeID: req.body.deleteIDs[i] },
      });
      console.log("Successfully deleted Node " + req.body.deleteIDs[i]);
    } catch (error) {
      console.error("Node with ID " + req.body.deleteIDs[i] + " not found!");
      res.sendStatus(204);
      return;
    }
  }
  res.sendStatus(200);
});

router.get("/edges", async function (req: Request, res: Response) {
  console.log("req");
  // Fetch the high score from Prisma
  const edges = await PrismaClient.edge.findMany();

  // If the high score doesn't exist
  if (edges === null) {
    // Log that (it's a problem)
    console.error("No nodes found in database!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(edges);
  }
});

router.post("/edges", async function (req: Request, res: Response) {
  console.log("req");
  console.log(req.body.deleteAll);
  if (req.body.deleteAll) {
    try {
      await PrismaClient.edge.deleteMany({});
      console.log("Successfully wiped Edges");
    } catch (error) {
      console.error("Unable to wipe Edges");
      res.sendStatus(204);
      return;
    }
  }
  const requestAttempt: Prisma.EdgeCreateManyInput = req.body.edges;

  try {
    await PrismaClient.edge.createMany({ data: requestAttempt });
    console.log("Successfully created Edges");
  } catch (error) {
    console.error("Unable to create Edges");
    console.log(error);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.delete("/edges", async function (req: Request, res: Response) {
  console.log("req");
  console.log(req.body.deleteAll);
  console.log(req.body.deleteIDs);

  if (req.body.deleteAll === "true") {
    try {
      await PrismaClient.edge.deleteMany({});
      console.log("Successfully wiped all Edges");
      res.sendStatus(200);
      return;
    } catch (error) {
      console.error("Unable to wipe all Edges");
      res.sendStatus(204);
      return;
    }
  }

  for (let i = 0; i < req.body.deleteIDs.length; i++) {
    try {
      await PrismaClient.edge.delete({
        where: { edgeID: req.body.deleteIDs[i] },
      });
      console.log("Successfully deleted Edge " + req.body.deleteIDs[i]);
    } catch (error) {
      console.error("Edge with ID " + req.body.deleteIDs[i] + " not found!");
      res.sendStatus(204);
      return;
    }
  }
  res.sendStatus(200);
});

export default router;
