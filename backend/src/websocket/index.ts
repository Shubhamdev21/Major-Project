import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';

let io: Server;

export const initWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, replace with frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected via WebSocket: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
