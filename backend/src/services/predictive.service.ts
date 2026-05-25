import prisma from '../prisma';
import logger from '../utils/logger';
import { getIO } from '../websocket';
import { sendTelegramAlert } from './telegram.service';

export const runPredictiveAnalysis = async () => {
  try {
    // Example: Predict if temperature is trending dangerously upwards
    // Get last 5 readings for TEMP_001
    const readings = await prisma.sensorReading.findMany({
      where: { sensor_id: 'TEMP_001' },
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    if (readings.length === 5) {
      // Simple trend analysis: are they strictly increasing?
      let isIncreasing = true;
      for (let i = 0; i < readings.length - 1; i++) {
        // Since order is desc, readings[0] is newest.
        if (Number(readings[i]?.value) <= Number(readings[i + 1]?.value)) {
          isIncreasing = false;
          break;
        }
      }

      if (isIncreasing && Number(readings[0]?.value) > 30) {
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

        // Send Telegram Alert
        await sendTelegramAlert(alert.message);
      }
    }
  } catch (err: any) {
    logger.error(`Predictive analysis error: ${err.message}`);
  }
};

// Run every 30 seconds
setInterval(runPredictiveAnalysis, 30000);
