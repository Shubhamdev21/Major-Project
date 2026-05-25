import mqtt from 'mqtt';
import logger from '../utils/logger';
import prisma from '../prisma';
import { getIO } from '../websocket';
import { evaluateRules } from '../services/automation.service';

const MQTT_URL = process.env.MQTT_BROKER_URL || 'mqtt://mosquitto:1883';

const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  logger.info(`Connected to MQTT broker at ${MQTT_URL}`);
  client.subscribe('factory/sensors/+', (err) => {
    if (err) logger.error(`MQTT Subscribe error: ${err}`);
    else logger.info('Subscribed to factory/sensors/+');
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const topicParts = topic.split('/');
    const sensorType = String(topicParts[topicParts.length - 1]);

    const reading = await prisma.sensorReading.create({
      data: {
        sensor_id: payload.sensor_id,
        sensor_type: sensorType,
        value: payload.value,
        unit: payload.unit,
        location: payload.location,
        status: payload.status,
        timestamp: new Date(),
      }
    });

    const io = getIO();
    io.emit('sensor_update', reading);

    await evaluateRules(reading);

  } catch (err: any) {
    logger.error(`Error processing MQTT message: ${err.message}`);
  }
});

client.on('error', (err) => {
  logger.error(`MQTT Error: ${err.message}`);
});

export default client;