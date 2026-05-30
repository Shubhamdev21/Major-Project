import prisma from '../prisma';
import mqttClient from '../mqtt';
import logger from '../utils/logger';
import { getIO } from '../websocket';
import { sendTelegramAlert } from './telegram.service';

// Cooldown map: ruleId -> last triggered timestamp
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown per rule

export const evaluateRules = async (reading: any) => {
  try {
    const rules = await prisma.automationRule.findMany({ where: { enabled: true } });

    for (const rule of rules) {
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
          // Check cooldown - skip if this rule fired within the last minute
          const lastFired = cooldowns.get(rule.id) || 0;
          const now = Date.now();
          if (now - lastFired < COOLDOWN_MS) {
            logger.info(`Rule ${rule.condition} skipped (cooldown active, ${Math.round((COOLDOWN_MS - (now - lastFired)) / 1000)}s remaining)`);
            continue;
          }

          // Update cooldown
          cooldowns.set(rule.id, now);

          logger.info(`Rule triggered: ${rule.condition} -> Action: ${rule.action}`);

          if (rule.action.startsWith('TURN_ON_')) {
            const actuator = String(rule.action.split('_')[2]).toLowerCase();
            const command = 'ON';
            mqttClient.publish(`factory/actuators/${actuator}`, JSON.stringify({ command, trigger: rule.id }));
            await prisma.actuatorLog.create({
              data: { actuator, command, status: 'TRIGGERED_BY_RULE' }
            });
          }

          const alert = await prisma.alert.create({
            data: {
              sensor_id: reading.sensor_id,
              severity: reading.value > threshold * 1.5 ? 'CRITICAL' : 'WARNING',
              message: `Rule triggered: ${rule.condition}. Value was ${reading.value.toFixed(2)}. Action: ${rule.action}`
            }
          });

          const io = getIO();
          io.emit('alert', alert);

          // Send Telegram alert (non-blocking)
          sendTelegramAlert(alert.message).catch(err =>
            logger.error(`Telegram send failed: ${err.message}`)
          );
        }
      }
    }
  } catch (err: any) {
    logger.error(`Rule evaluation error: ${err.message}`);
  }
};
