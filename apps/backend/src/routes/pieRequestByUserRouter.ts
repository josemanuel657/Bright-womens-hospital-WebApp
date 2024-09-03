import express, { Router } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req, res) {
  // Fetch service requests with associated employee emails
  const serviceRequests = await PrismaClient.serviceRequest.findMany({
    select: {
      employeeEmail: true,
    },
  });

  // Fetch employee full names using the fetched emails
  const employees = await PrismaClient.employee.findMany({
    where: {
      employeeEmail: {
        in: serviceRequests.map((request) => request.employeeEmail),
      },
    },
    select: {
      employeeEmail: true,
      employeeFullName: true,
    },
  });

  // Map employee emails to full names
  const emailToFullName = Object.fromEntries(
    employees.map((employee) => [
      employee.employeeEmail,
      employee.employeeFullName,
    ]),
  );

  // Group service requests by full name and service type
  const serviceRequestCounts = serviceRequests.reduce(
    (acc: Record<string, number>, request) => {
      const fullName = emailToFullName[request.employeeEmail];
      const key = `${fullName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  res.json(serviceRequestCounts);
});

export default router;
