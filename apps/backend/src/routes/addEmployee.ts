import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { EmployeeType } from "common/src/backend_interfaces/Employee.ts";

const router: Router = express.Router();

router.post("/", async (req, res) => {
  function generateId() {
    return Math.floor(Math.random() * 1000000000);
  }
  const employee: EmployeeType = req.body;
  try {
    const newEmployee = await PrismaClient.employee.create({
      data: {
        employeeEmail: employee.employeeEmail,
        employeeFirstName: employee.employeeFirstName,
        employeeLastName: employee.employeeLastName,
        employeeFullName:
          employee.employeeFirstName + " " + employee.employeeLastName,
        employeePosition: employee.employeePosition,
        employeePermission: employee.employeePermission,
        employeeID: generateId(),
        numberOfServiceRequests: 0,
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.post("/update", async (req, res) => {
  try {
    const employee: EmployeeType = req.body;
    const updatedEmployee = await PrismaClient.employee.update({
      where: {
        employeeEmail: employee.employeeEmail,
      },
      data: {
        employeeFirstName: employee.employeeFirstName,
        employeeLastName: employee.employeeLastName,
        employeeFullName:
          employee.employeeFirstName + " " + employee.employeeLastName,
        employeePosition: employee.employeePosition,
        employeePermission: employee.employeePermission,
      },
    });
    res.status(200).json(updatedEmployee);
  } catch {
    console.error("Unable to update employee");
    res.sendStatus(204);
  }
});

router.delete("/", async (req, res) => {
  try {
    const employee: EmployeeType = req.body;
    await PrismaClient.employee.delete({
      where: {
        employeeEmail: employee.employeeEmail,
      },
    });
    res.status(200).json({ message: "Employee deleted" });
  } catch {
    console.error("Unable to delete employee");
    res.sendStatus(204);
  }
});

export default router;
