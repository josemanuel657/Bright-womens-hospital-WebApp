// generic service request router
import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req, res) {
  const serviceRequestCounts = await PrismaClient.serviceRequest.groupBy({
    by: ["status", "serviceType"],
    _count: {
      SRID: true,
    },
  });

  res.json(serviceRequestCounts);
});
export default router;
