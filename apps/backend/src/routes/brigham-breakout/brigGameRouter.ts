//router to handle breakout brighman game highscores
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
const router: Router = express.Router();
import { breakoutHighScore } from "common/src/backend_interfaces/breakoutHighScore.ts";

router.post("/", async function (req, res) {
  const newhs: breakoutHighScore = req.body;

  console.log("Newhs.character", newhs.character);
  try {
    await PrismaClient.breakOutHighScore.create({
      data: {
        initial: newhs.initial.toLowerCase(),
        time: Number(newhs.time),
        date: new Date(),
        character: newhs.character.toLowerCase(),
      },
    });
    res.status(200).json({ message: "HS Posted" });
    console.log("yurp");
  } catch (error) {
    console.error("HS did not post :(");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

export default router;
