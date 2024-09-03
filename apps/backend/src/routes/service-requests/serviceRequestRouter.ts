// generic service request router
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";

const router: Router = express.Router();

router.get("/", async function (req, res) {
  const serviceRequests = await PrismaClient.serviceRequest.findMany({
    include: {
      Employee: {
        select: {
          employeeFullName: true,
          employeeEmail: true,
        },
      },
    },
  });

  const formattedServiceRequests = serviceRequests.map((sr) => ({
    ...sr,
    employeeEmail: `${sr.Employee.employeeFullName} (${sr.Employee.employeeEmail})`,
  }));

  console.log(formattedServiceRequests);
  res.json(formattedServiceRequests);
});

router.post("/", async function (req, res) {
  const serviceReq: ServiceRequest = req.body;

  try {
    await PrismaClient.serviceRequest.update({
      where: {
        SRID: serviceReq.SRID,
      },
      data: {
        status: serviceReq.status,
      },
    });

    res.status(200).json({ message: "Service Status Updated" });
    console.log("Service Status Updated Successfully");
  } catch (error) {
    console.error("Service Status Update Failed");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.delete("/", async function (req, res) {
  try {
    const { SRID } = req.body;

    // Create an array of delete operations
    const deleteOperations = [
      PrismaClient.flowerServiceRequest.deleteMany({ where: { SRID } }),
      PrismaClient.giftServiceRequest.deleteMany({ where: { SRID } }),
      PrismaClient.roomSchedulingRequest.deleteMany({ where: { SRID } }),
      PrismaClient.medicalDeviceServiceRequest.deleteMany({ where: { SRID } }),
      PrismaClient.medicineDeliveryServiceRequest.deleteMany({
        where: { SRID },
      }),
      PrismaClient.religiousServiceRequest.deleteMany({ where: { SRID } }),
      PrismaClient.foodDeliveryServiceRequest.deleteMany({ where: { SRID } }),
      PrismaClient.serviceRequest.delete({ where: { SRID } }),
    ];

    const serviceRequest = await PrismaClient.serviceRequest.findUnique({
      where: { SRID },
    });

    if (!serviceRequest) {
      console.error("Service Request not found");
      res.sendStatus(204);
      return;
    }
    const employeeEmail = serviceRequest.employeeEmail;
    if (!serviceRequest) {
      console.error("Service Request not found");
      res.sendStatus(204);
      return;
    }

    await PrismaClient.employee.update({
      where: {
        employeeEmail: employeeEmail,
      },
      data: {
        numberOfServiceRequests: {
          decrement: 1,
        },
      },
    });

    // Execute all delete operations in a transaction
    await PrismaClient.$transaction(deleteOperations);

    console.log("Successfully deleted service request with SRID: " + SRID);
    res.status(200).json({ message: "Successfully deleted service request" });
  } catch (error) {
    console.error("Error Deleting Service Request");
    console.log(error);
    res.sendStatus(204);
  }
});
export default router;
