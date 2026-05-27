import mqtt from 'mqtt';
import logger from '../utils/logger';

const MQTT_URL = process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC_PREFIX = process.env.MQTT_TOPIC_PREFIX || 'shubham_iot_major_2024/sensors';

const client = mqtt.connect(MQTT_URL);

const generateFluctuation = (base: number, variance: number) => {
  return base + (Math.random() * variance * 2 - variance);
};

const startSimulators = () => {
  setInterval(() => {
    const value = generateFluctuation(25, 10);
    client.publish(`${MQTT_TOPIC_PREFIX}/temperature`, JSON.stringify({
      sensor_id: 'TEMP_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'celsius',
      location: 'Assembly Line A',
      status: value > 30 ? 'WARNING' : 'NORMAL',
      timestamp: new Date().toISOString()
    }));
  }, 5000);

  setInterval(() => {
    const value = generateFluctuation(50, 15);
    client.publish(`${MQTT_TOPIC_PREFIX}/humidity`, JSON.stringify({
      sensor_id: 'HUM_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'percent',
      location: 'Assembly Line A',
      status: 'NORMAL',
      timestamp: new Date().toISOString()
    }));
  }, 6000);

  setInterval(() => {
    const value = generateFluctuation(400, 200);
    const isLeak = Math.random() > 0.95;
    const finalValue = isLeak ? generateFluctuation(900, 100) : value;
    client.publish(`${MQTT_TOPIC_PREFIX}/gas`, JSON.stringify({
      sensor_id: 'GAS_001',
      value: parseFloat(finalValue.toFixed(2)),
      unit: 'ppm',
      location: 'Chemical Storage',
      status: finalValue > 800 ? 'CRITICAL' : 'NORMAL',
      timestamp: new Date().toISOString()
    }));
  }, 4000);

  setInterval(() => {
    const value = generateFluctuation(300, 50);
    client.publish(`${MQTT_TOPIC_PREFIX}/light`, JSON.stringify({
      sensor_id: 'LGT_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'lux',
      location: 'Warehouse',
      status: 'NORMAL',
      timestamp: new Date().toISOString()
    }));
  }, 7000);

  logger.info('Sensor simulators started');
};

client.on('connect', () => {
  logger.info('Simulator connected to MQTT broker');
  startSimulators();
});

client.on('error', (err) => {
  logger.error(`Simulator MQTT error: ${err.message}`);
});

export default client;
