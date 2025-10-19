export const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send_message', (data) => {
      io.to(data.room).emit('receive_message', data);
    });

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
  });
};
