import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCurrentSensors = async (req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensorReading.groupBy({
      by: ['sensor_id', 'sensor_type', 'location'],
      _max: { timestamp: true },
    });
    const latestReadings = await Promise.all(
      sensors.map(async (s) => {
        return await prisma.sensorReading.findFirst({
          where: {
            sensor_id: s.sensor_id,
            ...(s._max.timestamp ? { timestamp: s._max.timestamp } : {})
          }
        });
      })
    );
    res.json(latestReadings.filter(Boolean));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSensorHistory = async (req: Request, res: Response) => {
  try {
    const { sensorId } = req.params;
    const history = await prisma.sensorReading.findMany({
      where: { sensor_id: String(sensorId) },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await prisma.sensorReading.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const count = await prisma.sensorReading.count();
    res.json({ totalReadings: count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};