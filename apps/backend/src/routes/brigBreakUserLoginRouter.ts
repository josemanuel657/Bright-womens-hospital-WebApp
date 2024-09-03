//router to handle breakout brighman game highscores
import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";
const router: Router = express.Router();

// Get all info for a specific user
router.get("/", async function (req, res) {
  const username =
    typeof req.query.username === "string" ? req.query.username : undefined;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.findUnique({
      where: { username: username },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get joeUnlocked status for a user
router.get("/joe", async function (req, res) {
  const username =
    typeof req.query.username === "string" ? req.query.username : undefined;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.findUnique({
      where: { username: username },
    });
    res.status(200).json(user?.joeUnlocked);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get wongUnlocked status for a user
router.get("/wong", async function (req, res) {
  const username =
    typeof req.query.username === "string" ? req.query.username : undefined;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.findUnique({
      where: { username: username },
    });
    res.status(200).json(user?.wongUnlocked);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get highscore for a user
router.get("/highscore", async function (req, res) {
  const username =
    typeof req.query.username === "string" ? req.query.username : undefined;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.findUnique({
      where: { username: username },
    });
    res.status(200).json({ highscore: user?.highscore });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async function (req, res) {
  const { username } = req.body;
  try {
    const user = await PrismaClient.brighamBreakoutUsers.upsert({
      where: { username: username },
      update: {},
      create: {
        username: username,
        highscore: 0,
        joeUnlocked: false,
        wongUnlocked: false,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
