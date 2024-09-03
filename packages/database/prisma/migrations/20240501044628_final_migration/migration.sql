-- CreateTable
CREATE TABLE "BreakOutHighScore" (
    "HSID" SERIAL NOT NULL,
    "initial" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreakOutHighScore_pkey" PRIMARY KEY ("HSID")
);

-- CreateTable
CREATE TABLE "BrighamBreakoutUsers" (
    "userID" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "highscore" INTEGER NOT NULL,
    "joeUnlocked" BOOLEAN NOT NULL,
    "wongUnlocked" BOOLEAN NOT NULL,

    CONSTRAINT "BrighamBreakoutUsers_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "weather" (
    "WID" INTEGER NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "weather_pkey" PRIMARY KEY ("WID")
);

-- CreateTable
CREATE TABLE "Edge" (
    "edgeID" TEXT NOT NULL,
    "startNodeID" TEXT NOT NULL,
    "endNodeID" TEXT NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("edgeID")
);

-- CreateTable
CREATE TABLE "Node" (
    "nodeID" TEXT NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "SRID" SERIAL NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeEmail" TEXT NOT NULL,
    "employeeFirstName" TEXT NOT NULL,
    "employeeLastName" TEXT NOT NULL,
    "employeeFullName" TEXT NOT NULL,
    "employeePosition" TEXT NOT NULL,
    "employeePermission" TEXT NOT NULL,
    "numberOfServiceRequests" INTEGER NOT NULL,
    "employeeID" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeEmail")
);

-- CreateTable
CREATE TABLE "FlowerServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "flowerType" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "deliveryDate" TEXT NOT NULL,

    CONSTRAINT "FlowerServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "RoomSchedulingRequest" (
    "SRID" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "RoomSchedulingRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "MedicalDeviceServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceQuantity" TEXT NOT NULL,

    CONSTRAINT "MedicalDeviceServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "ReligiousServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "religionName" TEXT NOT NULL,
    "objectName" TEXT NOT NULL,

    CONSTRAINT "ReligiousServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "GiftServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "senderName" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "giftType" TEXT NOT NULL,
    "deliveryDate" TEXT NOT NULL,

    CONSTRAINT "GiftServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "FoodDeliveryServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "foodItem" TEXT NOT NULL,
    "foodQuantity" TEXT NOT NULL,
    "utensilItem" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,

    CONSTRAINT "FoodDeliveryServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateTable
CREATE TABLE "MedicineDeliveryServiceRequest" (
    "SRID" INTEGER NOT NULL,
    "medicineType" TEXT NOT NULL,
    "dosageType" TEXT NOT NULL,
    "dosageAmount" TEXT NOT NULL,

    CONSTRAINT "MedicineDeliveryServiceRequest_pkey" PRIMARY KEY ("SRID")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrighamBreakoutUsers_username_key" ON "BrighamBreakoutUsers"("username");

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_startNodeID_fkey" FOREIGN KEY ("startNodeID") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_endNodeID_fkey" FOREIGN KEY ("endNodeID") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_employeeEmail_fkey" FOREIGN KEY ("employeeEmail") REFERENCES "Employee"("employeeEmail") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_location_fkey" FOREIGN KEY ("location") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowerServiceRequest" ADD CONSTRAINT "FlowerServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSchedulingRequest" ADD CONSTRAINT "RoomSchedulingRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDeviceServiceRequest" ADD CONSTRAINT "MedicalDeviceServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReligiousServiceRequest" ADD CONSTRAINT "ReligiousServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftServiceRequest" ADD CONSTRAINT "GiftServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodDeliveryServiceRequest" ADD CONSTRAINT "FoodDeliveryServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineDeliveryServiceRequest" ADD CONSTRAINT "MedicineDeliveryServiceRequest_SRID_fkey" FOREIGN KEY ("SRID") REFERENCES "ServiceRequest"("SRID") ON DELETE RESTRICT ON UPDATE CASCADE;
