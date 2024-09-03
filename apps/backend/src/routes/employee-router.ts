import express, { Router, Request, Response } from "express";
import { parseCSV } from "common/src/parser.ts";
import PrismaClient from "../bin/database-connection.ts";
import { EmployeeType } from "common/src/backend_interfaces/Employee.ts";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    await PrismaClient.employee.deleteMany({});

    // Parse the CSV string to an array of CSVEmployee objects
    const rowsEmployee = parseCSV(req.body["csvString"]);
    const transformedEmployee: EmployeeType[] = rowsEmployee.map((row) => {
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

    await PrismaClient.employee.createMany({
      data: transformedEmployee.map((self) => {
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

    res.sendStatus(200);
  } catch (error) {
    console.error(Error, "populating employee data: ${error}");
    res.sendStatus(500);
  }
});

router.get("/", async function (req: Request, res: Response) {
  try {
    const employeeCSV = await PrismaClient.employee.findMany();
    res.send(employeeCSV);
  } catch (error) {
    console.error(Error, "exporting employee data: ${error}");
    res.sendStatus(500);
  }
  res.sendStatus(200);
});
export default router;
