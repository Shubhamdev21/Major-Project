import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../prisma';
import mqttClient from '../mqtt';

export const controlActuator = async (req: Request, res: Response) => {
  try {
    const { device } = req.params; // e.g., 'fan', 'alarm'
    const { command } = req.body; // e.g., 'ON', 'OFF'

    // Log the command
    await prisma.actuatorLog.create({
      data: {
        actuator: String(device),
        command: command,
        status: 'PENDING'
      }
    });

    // Publish to MQTT
    const topic = `factory/actuators/${device}`;
    mqttClient.publish(topic, JSON.stringify({ command, timestamp: new Date().toISOString() }));

    res.json({ message: `Command ${command} sent to ${device}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const router = Router();
router.post('/:device/control', authenticate, controlActuator);

export default router;
