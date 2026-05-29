import prisma from '../prisma';
import logger from '../utils/logger';
import { getIO } from '../websocket';
import { sendTelegramAlert } from './telegram.service';

export const runPredictiveAnalysis = async () => {
  try {
    const readings = await prisma.sensorReading.findMany({
      where: { sensor_id: 'TEMP_001' },
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    if (readings.length === 5) {
      let isIncreasing = true;
      for (let i = 0; i < readings.length - 1; i++) {
        if (Number(readings[i]?.value) <= Number(readings[i + 1]?.value)) {
          isIncreasing = false;
          break;
        }
      }

      if (isIncreasing && Number(readings[0]?.value) > 30) {
        // Check if an unresolved predictive alert already exists in last 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const existing = await prisma.alert.findFirst({
          where: {
            sensor_id: 'TEMP_001',
            resolved: false,
            message: { contains: 'Predictive Alert' },
            createdAt: { gte: tenMinutesAgo }
          }
        });

        if (existing) {
          logger.info('Predictive alert already exists, skipping duplicate.');
          return;
        }

        logger.warn('Predictive Alert: Temperature is trending dangerously high.');

        const alert = await prisma.alert.create({
          data: {
            sensor_id: 'TEMP_001',
            severity: 'WARNING',
            message: 'Predictive Alert: Temperature predicted to exceed safe threshold shortly.'
          }
        });

        const io = getIO();
        io.emit('alert', alert);

        await sendTelegramAlert(alert.message);
      }
    }
  } catch (err: any) {
    logger.error(`Predictive analysis error: ${err.message}`);
  }
};

// Run every 30 seconds
setInterval(runPredictiveAnalysis, 30000);
