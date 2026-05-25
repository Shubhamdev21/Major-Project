import client from '../mqtt';
import logger from '../utils/logger';

const generateFluctuation = (base: number, variance: number) => {
  return base + (Math.random() * variance * 2 - variance);
};

const startSimulators = () => {
  // Temperature Simulator
  setInterval(() => {
    const value = generateFluctuation(25, 10); // 15 to 35
    const payload = {
      sensor_id: 'TEMP_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'celsius',
      location: 'Assembly Line A',
      status: value > 30 ? 'WARNING' : 'NORMAL',
      timestamp: new Date().toISOString()
    };
    client.publish('factory/sensors/temperature', JSON.stringify(payload));
  }, 5000);

  // Humidity Simulator
  setInterval(() => {
    const value = generateFluctuation(50, 15); // 35 to 65
    const payload = {
      sensor_id: 'HUM_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'percent',
      location: 'Assembly Line A',
      status: 'NORMAL',
      timestamp: new Date().toISOString()
    };
    client.publish('factory/sensors/humidity', JSON.stringify(payload));
  }, 6000);

  // Gas Simulator
  setInterval(() => {
    const value = generateFluctuation(400, 200); // 200 to 600
    // Occasional spike
    const isLeak = Math.random() > 0.95;
    const finalValue = isLeak ? generateFluctuation(900, 100) : value;
    
    const payload = {
      sensor_id: 'GAS_001',
      value: parseFloat(finalValue.toFixed(2)),
      unit: 'ppm',
      location: 'Chemical Storage',
      status: finalValue > 800 ? 'CRITICAL' : 'NORMAL',
      timestamp: new Date().toISOString()
    };
    client.publish('factory/sensors/gas', JSON.stringify(payload));
  }, 4000);

  // Light Simulator
  setInterval(() => {
    const value = generateFluctuation(300, 50); // 250 to 350
    const payload = {
      sensor_id: 'LGT_001',
      value: parseFloat(value.toFixed(2)),
      unit: 'lux',
      location: 'Warehouse',
      status: 'NORMAL',
      timestamp: new Date().toISOString()
    };
    client.publish('factory/sensors/light', JSON.stringify(payload));
  }, 7000);
};

client.on('connect', () => {
  logger.info('Sensor Simulator initialized using internal bus');
  startSimulators();
});

// Since it's a mock client and might already be "connected"
if (client) {
  startSimulators();
}

export default client;
