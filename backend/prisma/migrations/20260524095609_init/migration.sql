-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorReading" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "sensor_type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NORMAL',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActuatorLog" (
    "id" TEXT NOT NULL,
    "actuator" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActuatorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SensorReading_sensor_id_timestamp_idx" ON "SensorReading"("sensor_id", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "SensorReading_timestamp_idx" ON "SensorReading"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ActuatorLog_timestamp_idx" ON "ActuatorLog"("timestamp" DESC);
