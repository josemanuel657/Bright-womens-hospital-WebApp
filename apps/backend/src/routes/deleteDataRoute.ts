// flower service request router
import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.delete("/", async (req, res) => {
  try {
    // drop the sub service requests
    await PrismaClient.religiousServiceRequest.deleteMany({});
    await PrismaClient.giftServiceRequest.deleteMany({});
    await PrismaClient.medicalDeviceServiceRequest.deleteMany({});
    await PrismaClient.roomSchedulingRequest.deleteMany({});
    await PrismaClient.flowerServiceRequest.deleteMany({});
    await PrismaClient.medicineDeliveryServiceRequest.deleteMany({});

    // drop service request, and then reset the autoincrement to 1
    await PrismaClient.serviceRequest.deleteMany({});

    // drop all the highscore tables
    await PrismaClient.breakOutHighScore.deleteMany({});

    // drop the node and edge tables
    await PrismaClient.node.deleteMany({});
    await PrismaClient.edge.deleteMany({});
    await PrismaClient.employee.deleteMany({});

    res.status(200).json({ message: "Tables deleted successfully." });
  } catch (error) {
    console.error(`Error deleting tables: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
