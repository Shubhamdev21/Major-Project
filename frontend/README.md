# Industrial Environment Monitoring System

A production-grade IoT-based Industrial Environment Monitoring System built using MQTT, Node-RED, Next.js, WebSockets, and Multi-Sensor Cloud Integration.

The platform simulates a real industrial, factory, or greenhouse monitoring environment where multiple sensors continuously send environmental data in real time. The system visualizes data through live dashboards, performs automation using MQTT publish/subscribe architecture, and provides analytics with alert management.

---

# Project Overview

This project demonstrates the complete IoT layered architecture:

```text
Sensing Layer → Network Layer → Application Layer
```

The system monitors:

* Temperature
* Humidity
* Gas Leakage
* Light Intensity

using MQTT communication and real-time dashboards.

---

# Main Objectives

* Real-time industrial environment monitoring
* MQTT-based lightweight communication
* Multi-sensor data acquisition
* Node-RED dashboard visualization
* Real-time WebSocket updates
* Automation using MQTT publish/subscribe
* Historical analytics and alerts
* Cloud-ready IoT architecture

---

# IoT Architecture

```text
┌──────────────────────┐
│    Sensor Layer      │
│ Temp • Gas • Light   │
│ Humidity Sensors     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     MQTT Broker      │
│ Mosquitto / HiveMQ   │
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌──────────┐  ┌──────────┐
│ Backend  │  │ Node-RED │
│ Express  │  │ Dashboard│
└────┬─────┘  └────┬─────┘
     │             │
     ▼             ▼
┌──────────────────────┐
│   React Dashboard    │
│ Real-Time Analytics  │
└──────────────────────┘
```

---

# Features

## Real-Time Monitoring

* Live sensor readings
* Animated dashboards
* WebSocket-based updates

## MQTT Communication

* Publish/Subscribe architecture
* Lightweight IoT messaging
* Topic-based communication

## Node-RED Dashboard

* Live gauges
* Alerts
* Automation flows
* Visual IoT programming

## Automation Engine

Example:

```text
IF Gas > 800 ppm
THEN Turn ON Fan
```

## Analytics

* Historical sensor graphs
* Hourly averages
* Weekly trends
* Peak analysis

## Alerts System

* High temperature alerts
* Gas leakage detection
* Sensor failure alerts
* Real-time notifications

---

# Tech Stack

## Frontend

* Next.js 14
* TypeScript
* TailwindCSS
* Recharts
* Framer Motion
* Socket.io Client

## Backend

* Node.js
* Express.js
* MQTT.js
* Socket.io
* Prisma ORM

## Database

* PostgreSQL
* TimescaleDB
* Redis

## IoT & Cloud

* Mosquitto MQTT Broker
* HiveMQ Cloud
* Node-RED
* Docker

---

# Project Structure

```text
industrial-monitoring-system/
│
├── frontend/
├── backend/
├── simulators/
├── node-red/
├── docker/
├── docs/
└── README.md
```

---

# MQTT Topics

```text
factory/sensors/temperature
factory/sensors/humidity
factory/sensors/gas
factory/sensors/light

factory/actuators/fan
factory/actuators/alarm
```

---

# System Workflow

## Step 1: Data Collection

Sensors collect environmental data.

## Step 2: MQTT Communication

Sensor data is published to MQTT broker topics.

## Step 3: Backend Processing

Backend subscribes to MQTT topics and processes data.

## Step 4: Database Storage

Sensor readings are stored in PostgreSQL and TimescaleDB.

## Step 5: Real-Time Dashboard

Frontend receives updates via WebSockets.

## Step 6: Automation

Critical conditions trigger actuator commands automatically.

---

# Dashboard Features

* Real-time charts
* Temperature gauges
* Gas monitoring
* Alert feed
* Automation controls
* Historical analytics

---

# Example Automation Rule

```text
IF Gas Level > 800 ppm
→ Trigger Alert
→ Turn ON Exhaust Fan
→ Notify Dashboard
```

---

# Sensor Simulation

This project includes virtual sensor simulators that generate realistic industrial data for:

* Temperature
* Humidity
* Gas
* Light

The simulator acts as a digital twin of a real industrial environment.

---

# Docker Setup

Start all services:

```bash
docker-compose up
```

Services Included:

* Mosquitto MQTT Broker
* PostgreSQL
* Redis
* Node-RED

---

# Getting Started

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 3. Setup Environment Variables

Create `.env` files.

Example:

```env
DATABASE_URL=
JWT_SECRET=
MQTT_BROKER_URL=
```

---

## 4. Run Development Servers

### Frontend

```bash
npm run dev
```

### Backend

```bash
npm run dev
```

# Application URLs

| Service            | URL                      |
| ------------------ | ------------------------ |
| Frontend           | http://localhost:3000    |
| Backend            | http://localhost:5000    |
| Node-RED           | http://localhost:1880    |
| Node-RED Dashboard | http://localhost:1880/ui 


# Deployment

| Service     | Platform        |
| ----------- | --------------- |
| Frontend    | Vercel          |
| Backend     | Railway         |
| MQTT Broker | HiveMQ Cloud    |
| Database    | Timescale Cloud |



# Security Features

* JWT Authentication
* Rate Limiting
* Helmet Security
* Input Validation
* Secure MQTT Communication



# Future Enhancements

* AI-based predictive maintenance
* Mobile application
* Real hardware sensor integration
* Edge computing
* Camera surveillance
* Machine learning analytics



# Learning Outcomes

This project helped in understanding:

* IoT architecture
* MQTT protocol
* Real-time systems
* WebSockets
* Industrial automation
* Cloud integration
* Node-RED workflows
* Full-stack development




This project is developed for educational and research purposes.
