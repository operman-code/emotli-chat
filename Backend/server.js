import http from 'http';
import app from './src/app.js';
import { Server } from 'socket.io';
import { setupChatSocket } from './src/sockets/chatSocket.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});

setupChatSocket(io);

server.listen(PORT, () => {
  console.log(`Emotli backend running on port ${PORT}`);
});
