import prisma from '../prisma';
import mqttClient from '../mqtt';
import logger from '../utils/logger';
import { getIO } from '../websocket';
import { sendTelegramAlert } from './telegram.service';

export const evaluateRules = async (reading: any) => {
  try {
    const rules = await prisma.automationRule.findMany({ where: { enabled: true } });

    for (const rule of rules) {
      // rule.condition like "temperature > 40" or "gas > 800"
      // Basic parser for "sensor_type operator value"
      const parts = rule.condition.split(' ');
      if (parts.length !== 3) continue;

      const [type, operator, valStr] = parts;
      const threshold = parseFloat(String(valStr));

      if (reading.sensor_type === type) {
        let triggered = false;
        if (operator === '>' && reading.value > threshold) triggered = true;
        if (operator === '<' && reading.value < threshold) triggered = true;
        if (operator === '==' && reading.value === threshold) triggered = true;

        if (triggered) {
          logger.info(`Rule triggered: ${rule.condition} -> Action: ${rule.action}`);

          // Example Action: "TURN_ON_FAN"
          if (rule.action.startsWith('TURN_ON_')) {
            const actuator = String(rule.action.split('_')[2]).toLowerCase(); // e.g. 'fan'
            const command = 'ON';
            mqttClient.publish(`factory/actuators/${actuator}`, JSON.stringify({ command, trigger: rule.id }));
            
            await prisma.actuatorLog.create({
              data: {
                actuator,
                command,
                status: 'TRIGGERED_BY_RULE'
              }
            });
          }

          // Generate an Alert
          const alert = await prisma.alert.create({
            data: {
              sensor_id: reading.sensor_id,
              severity: 'CRITICAL',
              message: `Rule triggered: ${rule.condition}. Value was ${reading.value}. Action: ${rule.action}`
            }
          });

          // Broadcast alert via WS
          const io = getIO();
          io.emit('alert', alert);

          // Send Telegram Alert
          await sendTelegramAlert(alert.message);
        }
      }
    }
  } catch (err: any) {
    logger.error(`Rule evaluation error: ${err.message}`);
  }
};
