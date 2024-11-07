import { Server as SocketServer, Socket } from 'socket.io';
import http from 'http';
import { logger } from '../../common/util/logger'; // Adjust the path to your logger

// Function to initialize the socket server
export function initializeSocket(server: http.Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`New WebSocket connection: ${socket.id}`);

    socket.on('joinRoom', (roomName: string) => {
      socket.join(roomName);
      logger.info(`Socket ${socket.id} joined room: ${roomName}`);

      io.to(roomName).emit('message', `User ${socket.id} has joined the room.`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket ${socket.id} disconnected`);
    });
  });

  logger.info('Socket server initialized');
}
