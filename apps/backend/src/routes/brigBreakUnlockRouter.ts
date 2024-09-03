import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";
const router: Router = express.Router();

// Unlock Joe for a user
router.post("/joe", async function (req, res) {
  console.log("request received");
  const { username } = req.body;
  console.log(username);
  try {
    const user = await PrismaClient.brighamBreakoutUsers.update({
      where: { username: username },
      data: { joeUnlocked: true },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Unlock Wong for a user
router.post("/wong", async function (req, res) {
  const { username } = req.body;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.update({
      where: { username: username },
      data: { wongUnlocked: true },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
