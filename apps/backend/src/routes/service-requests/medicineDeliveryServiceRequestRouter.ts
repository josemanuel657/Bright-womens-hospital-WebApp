import { medicineDeliveryRequest } from "common/src/backend_interfaces/medicineDeliveryRequest.ts";
import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const medicine: medicineDeliveryRequest = req.body;
  console.log(medicine);

  try {
    const serviceRequest = await PrismaClient.serviceRequest.create({
      data: {
        employeeEmail: medicine.employeeEmail,
        priority: medicine.priority,
        location: medicine.location,
        status: medicine.status,
        serviceType: medicine.serviceType,
        description: medicine.description,
      },
    });

    const medicineDelivery =
      await PrismaClient.medicineDeliveryServiceRequest.upsert({
        where: {
          SRID: serviceRequest.SRID,
        },
        create: {
          SRID: serviceRequest.SRID,
          medicineType: medicine.medicineType,
          dosageType: medicine.dosageType,
          dosageAmount: medicine.dosageAmount,
        },
        update: {
          medicineType: medicine.medicineType,
          dosageType: medicine.dosageType,
          dosageAmount: medicine.dosageAmount,
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

    if (!medicineDelivery) {
      res.status(500).json({
        message:
          "Medical device failed, but service request succeeded, dropping said service request",
      });
      console.log("medical failed, but not service request");
      // drop the table entry
    } else {
      res.status(200).json({
        message: "Medical Device Request has been put into the database",
      });
    }
    console.log("Successfully posted to medical device.");
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.get("/", async function (req, res) {
  console.log(req);

  const medicalDeliveryForm =
    await PrismaClient.medicineDeliveryServiceRequest.findUnique({
      where: {
        SRID: Number(req.query.SRID),
      },
    });
  if (medicalDeliveryForm) {
    res.status(200).json(medicalDeliveryForm);
  } else {
    res.sendStatus(204);
  }
  res.json(medicalDeliveryForm);
});
export default router;
