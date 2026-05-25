import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import logger from './utils/logger';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Route imports
import authRoutes from './routes/auth.routes';
import sensorRoutes from './routes/sensor.routes';
import alertRoutes from './routes/alert.routes';
import automationRoutes from './routes/automation.routes';
import actuatorRoutes from './routes/actuator.routes';
import subscriberRoutes from './routes/subscriber.routes';

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/actuators', actuatorRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Initialize WebSockets
import { initWebSocket } from './websocket';
initWebSocket(server);

// Initialize MQTT Client
setTimeout(() => {
  require('./mqtt');
  
  // Initialize Simulators (For development/demo purposes)
  require('./simulators');
  
  // Initialize Predictive Service
  require('./services/predictive.service');
}, 1000);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});