import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req, res) {
  // Fetch service requests
  const serviceRequests = await PrismaClient.serviceRequest.findMany();

  // Group service requests by status and count them
  const serviceRequestCounts = serviceRequests.reduce(
    (acc: Record<string, number>, request) => {
      const key = request.serviceType;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  res.json(serviceRequestCounts);
});

export default router;
