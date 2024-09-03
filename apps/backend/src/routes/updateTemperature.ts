import express, { Router, Request } from "express";

const router: Router = express.Router();

router.post("/", async (req: Request) => {
  const floatValue: number = req.body.value;
  console.log(floatValue);
  //currentTemperature = floatValue;
});

export default router;
