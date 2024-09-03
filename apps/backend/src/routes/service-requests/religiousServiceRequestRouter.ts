import { religiousServiceRequest } from "common/src/backend_interfaces/religiousServiceRequest.ts";
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const religion: religiousServiceRequest = req.body;

  try {
    const serviceRequest = await PrismaClient.serviceRequest.create({
      data: {
        employeeEmail: religion.employeeEmail,
        priority: religion.priority,
        location: religion.location,
        status: religion.status,
        serviceType: religion.serviceType,
        description: religion.description,
      },
    });

    await PrismaClient.religiousServiceRequest.upsert({
      where: {
        SRID: serviceRequest.SRID,
      },
      create: {
        SRID: serviceRequest.SRID,
        religionName: religion.religionName,
        objectName: religion.objectName,
      },
      update: {
        religionName: religion.religionName,
        objectName: religion.objectName,
      },
    });

    await PrismaClient.employee.update({
      where: {
        employeeEmail: serviceRequest.employeeEmail,
      },
      data: {
        numberOfServiceRequests: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      message: "Religious Service Request has been put into the database",
    });
    console.log("Successfully posted to religious.");
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.get("/", async function (req, res) {
  const religiousForm = await PrismaClient.religiousServiceRequest.findUnique({
    where: {
      SRID: Number(req.query.SRID),
    },
  });
  res.json(religiousForm);
});
export default router;
