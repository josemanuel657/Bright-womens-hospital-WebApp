import { MedicalDevice } from "common/src/backend_interfaces/medicalDeviceRequest.ts";
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const medicalDevice: MedicalDevice = req.body;

  console.log("testing");

  try {
    const serviceRequest = await PrismaClient.serviceRequest.create({
      data: {
        employeeEmail: medicalDevice.employeeEmail,
        priority: medicalDevice.priority,
        location: medicalDevice.location,
        status: medicalDevice.status,
        serviceType: medicalDevice.serviceType,
        description: medicalDevice.description,
      },
    });

    await PrismaClient.medicalDeviceServiceRequest.upsert({
      where: {
        SRID: serviceRequest.SRID,
      },
      create: {
        SRID: serviceRequest.SRID,
        deviceName: medicalDevice.deviceName,
        deviceQuantity: medicalDevice.deviceQuantity,
      },
      update: {
        deviceName: medicalDevice.deviceName,
        deviceQuantity: medicalDevice.deviceQuantity,
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
      message: "Medical Device Request has been put into the database",
    });
    console.log("Successfully posted to medical device.");
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.get("/", async function (req, res) {
  const medicalDeviceForm =
    await PrismaClient.medicalDeviceServiceRequest.findUnique({
      where: {
        SRID: Number(req.query.SRID),
      },
    });
  res.json(medicalDeviceForm);
});

export default router;
