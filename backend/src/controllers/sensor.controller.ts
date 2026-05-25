import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCurrentSensors = async (req: Request, res: Response) => {
  try {
    // Get latest reading for each sensor
    const sensors = await prisma.sensorReading.groupBy({
      by: ['sensor_id', 'sensor_type', 'location'],
      _max: {
        timestamp: true,
      },
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

    res.json(latestReadings);
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

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Simple mock analytics for now, can be expanded with TimescaleDB specific queries
    const count = await prisma.sensorReading.count();
    res.json({ totalReadings: count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
