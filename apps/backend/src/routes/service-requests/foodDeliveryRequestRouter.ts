import express, { Router } from "express";
import PrismaClient from "../../bin/database-connection.ts";
import { foodDeliveryServiceRequest } from "common/src/backend_interfaces/foodDeliveryRequest.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const food: foodDeliveryServiceRequest = req.body;

  try {
    const serviceRequest = await PrismaClient.serviceRequest.create({
      data: {
        employeeEmail: food.employeeEmail,
        priority: food.priority,
        location: food.location,
        status: food.status,
        serviceType: food.serviceType,
        description: food.description,
      },
    });

    await PrismaClient.foodDeliveryServiceRequest.upsert({
      where: {
        SRID: serviceRequest.SRID,
      },
      create: {
        SRID: serviceRequest.SRID,
        foodItem: food.foodItem,
        foodQuantity: food.foodQuantity,
        utensilItem: food.utensilItem,
        deliveryTime: food.deliveryTime,
      },
      update: {
        foodItem: food.foodItem,
        foodQuantity: food.foodQuantity,
        utensilItem: food.utensilItem,
        deliveryTime: food.deliveryTime,
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
      message: "Food Delivery Request has been put into the database",
    });
    console.log("Successfully posted to food");
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

router.get("/", async function (req, res) {
  const foodForm = await PrismaClient.foodDeliveryServiceRequest.findUnique({
    include: {
      ServiceRequest: true,
    },
    where: {
      SRID: Number(req.query.SRID),
    },
  });
  res.json(foodForm);
});

export default router;
