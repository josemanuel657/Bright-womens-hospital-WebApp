import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { parseCSV } from "common/src/parser.ts";
import { EmployeeType } from "common/src/backend_interfaces/Employee.ts";

const router: Router = express.Router();

function convertToCSV(data: EmployeeType[]): string {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((node) => Object.values(node).join(","));
  return `${headers}\n${rows.join("\n")}`;
}
router.post("/", async function (req: Request, res: Response) {
  try {
    // Get the JSON body from the JSON object
    const employeeCSVData = req.body["csvString"];
    const parsedCSVData = parseCSV(employeeCSVData);

    const transformedEmp: EmployeeType[] = parsedCSVData.map((row) => {
      const rowval = Object.values(row);
      return {
        employeeEmail: rowval[0],
        employeeFirstName: rowval[1],
        employeeLastName: rowval[2],
        employeeFullName: rowval[1] + " " + rowval[2],
        employeePosition: rowval[3],
        employeePermission: rowval[4],
        numberOfServiceRequests: parseInt(rowval[5]),
        employeeID: parseInt(rowval[6]),
      };
    });

    // Create records in 'employee' table
    await PrismaClient.employee.createMany({
      data: transformedEmp.map((self) => {
        return {
          employeeEmail: self.employeeEmail,
          employeeFirstName: self.employeeFirstName,
          employeeLastName: self.employeeLastName,
          employeeFullName: self.employeeFullName,
          employeePosition: self.employeePosition,
          employeePermission: self.employeePermission,
          numberOfServiceRequests: self.numberOfServiceRequests,
          employeeID: self.employeeID,
        };
      }),
    });

    // Send success response
    res.sendStatus(200);
  } catch (error) {
    console.error(`Error storing data: ${error}`);
    // Send error response
    res.sendStatus(500);
  }
});

router.get("/", async function (req: Request, res: Response) {
  try {
    const employeeCSV = await PrismaClient.employee.findMany();
    const csvEdge: string = convertToCSV(employeeCSV);
    res.send(csvEdge);
  } catch (error) {
    console.error(`Error exporting node data: ${error}`);
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

export default router;
