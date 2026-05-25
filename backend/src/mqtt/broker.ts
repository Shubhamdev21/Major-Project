import net from 'net';
import http from 'http';
import ws from 'websocket-stream';
import logger from '../utils/logger';

// @ts-ignore
const aedes = require('aedes')();

// TCP Server for Backend/Simulators
const tcpServer = net.createServer(aedes.handle);
const MQTT_PORT = 1883;

tcpServer.listen(MQTT_PORT, () => {
  logger.info(`Aedes MQTT Broker running on TCP port ${MQTT_PORT}`);
});

// WebSocket Server for Frontend Clients
const httpServer = http.createServer();
ws.createServer({ server: httpServer }, aedes.handle as any);

const WS_PORT = 9001;
httpServer.listen(WS_PORT, () => {
  logger.info(`Aedes MQTT Broker running on WebSocket port ${WS_PORT}`);
});
