const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

const locations = ['Zone-A', 'Zone-B', 'Zone-C', 'Warehouse'];

function randomBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function publishSensorData() {
  const location = locations[Math.floor(Math.random() * locations.length)];

  // Temperature (15°C - 45°C)
  client.publish('factory/sensors/temperature', JSON.stringify({
    sensor_id: `TEMP_${location}`,
    sensor_type: 'temperature',
    value: parseFloat(randomBetween(15, 45)),
    unit: '°C',
    location,
    status: 'NORMAL'
  }));

  // Humidity (30% - 90%)
  client.publish('factory/sensors/humidity', JSON.stringify({
    sensor_id: `HUM_${location}`,
    sensor_type: 'humidity',
    value: parseFloat(randomBetween(30, 90)),
    unit: '%',
    location,
    status: 'NORMAL'
  }));

  // Gas (200 - 1000 ppm)
  const gasValue = parseFloat(randomBetween(700, 1000));
  client.publish('factory/sensors/gas', JSON.stringify({
    sensor_id: `GAS_${location}`,
    sensor_type: 'gas',
    value: gasValue,
    unit: 'ppm',
    location,
    status: gasValue > 800 ? 'CRITICAL' : 'NORMAL'
  }));

  // Light (100 - 1000 lux)
  client.publish('factory/sensors/light', JSON.stringify({
    sensor_id: `LIGHT_${location}`,
    sensor_type: 'light',
    value: parseFloat(randomBetween(100, 1000)),
    unit: 'lux',
    location,
    status: 'NORMAL'
  }));

  console.log(`[SIMULATOR] Published sensor data from ${location}`);
}

client.on('connect', () => {
  console.log('✅ Simulator connected to MQTT broker!');
  console.log('📡 Publishing sensor data every 5 seconds...');
  
  // Publish immediately
  publishSensorData();
  
  // Then every 5 seconds
  setInterval(publishSensorData, 5000);
});

client.on('error', (err) => {
  console.error('❌ MQTT Error:', err.message);
});