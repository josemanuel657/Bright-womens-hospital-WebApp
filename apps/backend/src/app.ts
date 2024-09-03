import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import nodesRouter from "./routes/nodes";
import pathRouter from "./routes/path";
import edgesRouter from "./routes/edges";
import flowerRouter from "./routes/service-requests/flowerDeliveryRequestRouter.ts";
import roomSchedulingRequestRouter from "./routes/service-requests/roomSchedulingRequestRouter.ts";
import giftServiceRequestRouter from "./routes/service-requests/giftServiceRequestRouter.ts";
import serviceRequestRouter from "./routes/service-requests/serviceRequestRouter.ts";
import medicalDeviceRouter from "./routes/service-requests/medicalDeviceServiceRequestRouter.ts";
import medicineDeliveryRouter from "./routes/service-requests/medicineDeliveryServiceRequestRouter.ts";
import religiousServiceRequestRouter from "./routes/service-requests/religiousServiceRequestRouter.ts";
import foodDeliveryRequestRouter from "./routes/service-requests/foodDeliveryRequestRouter.ts";
import csvRouter from "./routes/csv-handler";
import nodeRouter from "./routes/node-route";
import edgeRouter from "./routes/edge-route";
import downloadNodeDataRouter from "./routes/data-to-csv-node";
import downloadEdgeDataRouter from "./routes/data-to-csv-edge";
import deleteDataRouter from "./routes/deleteDataRoute";
import roomNameFetchRouter from "./routes/dropdowns/room-name-fetch.ts";
import employeeEmailFetchRouter from "./routes/dropdowns/employeeEmailRouter.ts";
import addNodesRouter from "./routes/addNodes.ts";
import deleteNodesAndAssociatedEdgesRouter from "./routes/deleteNodesEdges";
import refactorNodesRouter from "./routes/refactorNodes";
import addEdgesRouter from "./routes/addEdges";
import deleteEdgesRouter from "./routes/deleteEdges";
import refactorEdgesRouter from "./routes/refactorEdges";
import employeeRouter from "./routes/employee-router.ts";
import downloadEmployeeDataRouter from "./routes/data-to-csv-employee.ts";
import requestByUserRouter from "./routes/requestByUserRouter.ts";
import requestByPriorityRouter from "./routes/requestByPriorityRouter.ts";
import requestByStatusRouter from "./routes/requestByStatusRouter";
import pieRequestByUserRouter from "./routes/pieRequestByUserRouter.ts";
import pieRequestByPriorityRouter from "./routes/pieRequestByPriorityRouter.ts";
import pieRequestByStatusRouter from "./routes/pieRequestByStatusRouter.ts";
import pieRequestByTypeRouter from "./routes/pieRequestByTypeRouter.ts";
import updateTemperatureRouter from "./routes/updateTemperature.ts";
import brigRouter from "./routes/brigham-breakout/brigGameRouter.ts";
import brigAllTime from "./routes/brigham-breakout/breakoutAllTimeRouter.ts";
import brigToday from "./routes/brigham-breakout/breakoutTodayRouter.ts";
import weatherRouter from "./routes/weather/weatherRouter.ts";
import addEmployee from "./routes/addEmployee.ts";
import brigBreakUserLoginRouter from "./routes/brigBreakUserLoginRouter.ts";
import brigBreakUnlockRouter from "./routes/brigBreakUnlockRouter.ts";

const app: Express = express(); // Set up the backend

// Setup generic middleware
app.use(
  logger("dev", {
    stream: {
      // This is a "hack" that gets the output to appear in the remote debugger :)
      write: (msg) => console.info(msg),
    },
  }),
); // This records all HTTP requests
app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// service requests
app.use("/api/service-request", serviceRequestRouter);
app.use("/api/flower-service-request", flowerRouter);
app.use("/api/room-scheduling-request", roomSchedulingRequestRouter);
app.use("/api/medical-device-service-request", medicalDeviceRouter);
app.use("/api/medicine-delivery-service-request", medicineDeliveryRouter);
app.use("/api/religious-service-request", religiousServiceRequestRouter);
app.use("/api/gift-service-request", giftServiceRequestRouter);
app.use("/api/food-delivery-service-request", foodDeliveryRequestRouter);
app.use("/api/brig-hs-request", brigRouter);
app.use("/api/hs-all-time", brigAllTime);
app.use("/api/hs-today", brigToday);
// api fetch (for the dropdowns)
app.use("/api/room-name-fetch", roomNameFetchRouter);
app.use("/api/employee-email-fetch", employeeEmailFetchRouter);

// CSV Pages - General
app.use("/api/csv-to-json", csvRouter);
app.use("/api/delete-data", deleteDataRouter);
// CSV Page: Nodes
app.use("/api/node-populate", nodeRouter);
app.use("/api/download-node-csv", downloadNodeDataRouter);
// CSV Page: Edges
app.use("/api/edge-populate", edgeRouter);
app.use("/api/download-edge-csv", downloadEdgeDataRouter);
// CSV Page: Employees
app.use("/api/employee-populate", employeeRouter);
app.use("/api/download-employee-csv", downloadEmployeeDataRouter);
// Brig Breakout: User Login and Unlocks
app.use("/api/sign-in-brig-user", brigBreakUserLoginRouter);
app.use("/api/unlock-character", brigBreakUnlockRouter);
app.use("/api/add-employee", addEmployee);

// Graphs
app.use("/api/request-by-user", requestByUserRouter);
app.use("/api/request-by-priority", requestByPriorityRouter);
app.use("/api/request-by-status", requestByStatusRouter);

app.use("/api/pie-request-by-type", pieRequestByTypeRouter);
app.use("/api/pie-request-by-user", pieRequestByUserRouter);
app.use("/api/pie-request-by-priority", pieRequestByPriorityRouter);
app.use("/api/pie-request-by-status", pieRequestByStatusRouter);

// weather
app.use("/api/weather", weatherRouter);

app.use("/healthcheck", (req, res) => {
  res.status(200).send();
});

// Algos
app.use("/api/nodes", nodesRouter);
app.use("/api/path", pathRouter);
app.use("/api/edges", edgesRouter);

app.use(
  "/api/delete-nodes-and-associated-edges",
  deleteNodesAndAssociatedEdgesRouter,
);
app.use("/api/refactor-nodes", refactorNodesRouter);
app.use("/api/add-nodes", addNodesRouter);

app.use("/api/delete-edges", deleteEdgesRouter);
app.use("/api/refactor-edges", refactorEdgesRouter);
app.use("/api/add-edges", addEdgesRouter);

app.use("/api/update-temperature", updateTemperatureRouter);

/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use(function (req: Request, res: Response, next: NextFunction): void {
  // Have the next (generic error handler) process a 404 error
  next(createError(404, `Not Found: ${req.method} ${req.path}`));
});

/**
 * Generic error handler
 */
app.use((err: HttpError, req: Request, res: Response): void => {
  // Log the error to the console for debugging
  console.error(`Error - ${err.status || 500} - ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip,
  });

  res.status(err.status || 500).send({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
      path: req.path,
      method: req.method,
    },
  });
});

export default app; // Export the backend, so that www.ts can start it
