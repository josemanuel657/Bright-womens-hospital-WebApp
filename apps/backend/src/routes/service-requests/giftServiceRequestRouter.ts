import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
import { giftDeliveryRequest } from "common/src/backend_interfaces/giftDeliveryRequest.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const gift: giftDeliveryRequest = req.body;

  try {
    const serviceRequest = await PrismaClient.serviceRequest.create({
      data: {
        employeeEmail: gift.employeeEmail,
        priority: gift.priority,
        location: gift.location,
        status: gift.status,
        serviceType: gift.serviceType,
        description: gift.description,
      },
    });
    await PrismaClient.giftServiceRequest.upsert({
      where: {
        SRID: serviceRequest.SRID,
      },
      create: {
        SRID: serviceRequest.SRID,
        senderName: gift.senderName,
        receiverName: gift.receiverName,
        giftType: gift.giftType,
        deliveryDate: gift.deliveryDate,
      },
      update: {
        senderName: gift.senderName,
        receiverName: gift.receiverName,
        giftType: gift.giftType,
        deliveryDate: gift.deliveryDate,
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
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return;
  }
});

router.get("/", async function (req, res) {
  const giftForm = await PrismaClient.giftServiceRequest.findUnique({
    where: {
      SRID: Number(req.query.SRID),
    },
  });
  if (giftForm) {
    res.status(200).json(giftForm);
  } else {
    res.sendStatus(204);
  }
});

export default router;
