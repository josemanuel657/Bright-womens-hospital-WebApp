//router to handle breakout brighman game highscores
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
const router: Router = express.Router();

router.get("/", async function (req, res) {
  const today = new Date();
  today.setHours(0);

  try {
    const highScoreFetch = await PrismaClient.breakOutHighScore.findMany({
      where: {
        date: {
          gte: today,
        },
      },
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
    console.log("Wooo! That was posted");
  } catch (error) {
    console.log("that failed :(");
    console.log(error);
  }
});

export default router;
