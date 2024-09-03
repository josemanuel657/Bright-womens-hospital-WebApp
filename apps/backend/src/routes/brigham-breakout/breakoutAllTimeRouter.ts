//router to handle breakout brighman game highscores
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
const router: Router = express.Router();

router.get("/", async function (req, res) {
  const highScoreFetch = await PrismaClient.breakOutHighScore.findMany({
    orderBy: {
      time: "desc",
    },
    take: 20,
    select: {
      time: true,
      initial: true,
      character: true,
    },
  });

  res.json(highScoreFetch);
});

export default router;
