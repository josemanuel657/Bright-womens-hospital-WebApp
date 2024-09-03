// weather router for the hero page
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
import { Weather } from "common/src/backend_interfaces/weather.ts";

const router: Router = express.Router();

router.get("/", async function (req, res) {
  const weather = await PrismaClient.weather.findUnique({
    where: {
      WID: 1,
    },
    select: {
      temp: true,
      time: true, // {hour}:{min}
      date: true,
    },
  });

  console.log(weather);
  res.json(weather);
});

router.post("/", async function (req, res) {
  const weather: Weather = req.body;

  try {
    await PrismaClient.weather.upsert({
      where: {
        WID: 1,
      },
      create: {
        WID: 1,
        temp: weather.temp,
        time: weather.time,
        date: weather.date,
      },
      update: {
        temp: weather.temp,
        time: weather.time,
        date: weather.date,
      },
    });

    res.status(200).json({ message: "weather has been updated" });
    console.log("weather updated");
  } catch (error) {
    console.error("weather failed to update");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

export default router;
