import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";

import { edge } from "common/src/interfaces.ts";

const router: Router = express.Router();

function convertToCSV(data: edge[]): string {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((edge) => Object.values(edge).join(","));
  return `${headers}\n${rows.join("\n")}`;
}

router.get("/", async function (req: Request, res: Response) {
  try {
    const edgeCSV = await PrismaClient.edge.findMany();
    const csvEdge: string = convertToCSV(edgeCSV);
    res.send(csvEdge);
  } catch (error) {
    console.error(`Error exporting edge data: ${error}`);
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

export default router;
