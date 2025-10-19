import pool from '../config/db.js';
import { profanityFilter } from '../middlewares/profanityFilter.js';

export const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication and online status
    socket.on('authenticate', async (userId) => {
      try {
        await pool.query('UPDATE users SET is_online = 1 WHERE id = ?', [userId]);
        socket.userId = userId;
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated and online`);
      } catch (error) {
        console.error('Authentication error:', error);
      }
    });

    // Private messaging
    socket.on('send_private_message', async (data) => {
      try {
        const { receiverId, message } = data;
        const senderId = socket.userId;
        
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Check if users are friends
        const [friendship] = await pool.query(
          'SELECT * FROM friendships WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?) AND status = "accepted"',
          [senderId, receiverId, receiverId, senderId]
        );
        
        if (!friendship.length) {
          socket.emit('error', { message: 'You can only message friends' });
          return;
        }

        // Save message to database
        const [result] = await pool.query(
          'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())',
          [senderId, receiverId, message]
        );

        const messageData = {
          id: result.insertId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: message,
          timestamp: new Date()
        };

        // Send to both users
        io.to(`user_${receiverId}`).emit('receive_private_message', messageData);
        socket.emit('receive_private_message', messageData);
      } catch (error) {
        console.error('Private message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Group messaging
    socket.on('send_group_message', async (data) => {
      try {
        const { groupId, message } = data;
        const senderId = socket.userId;
        
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Check if user is member of group
        const [membership] = await pool.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, senderId]);
        if (!membership.length) {
          socket.emit('error', { message: 'You are not a member of this group' });
          return;
        }

        // Save message to database
        const [result] = await pool.query(
          'INSERT INTO group_messages (group_id, sender_id, content, timestamp) VALUES (?, ?, ?, NOW())',
          [groupId, senderId, message]
        );

        const messageData = {
          id: result.insertId,
          group_id: groupId,
          sender_id: senderId,
          content: message,
          timestamp: new Date()
        };

        // Send to all group members
        io.to(`group_${groupId}`).emit('receive_group_message', messageData);
      } catch (error) {
        console.error('Group message error:', error);
        socket.emit('error', { message: 'Failed to send group message' });
      }
    });

    // Therapy messaging
    socket.on('send_therapy_message', async (data) => {
      try {
        const { sessionId, message } = data;
        const senderId = socket.userId;
        
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Check if user is part of this therapy session
        const [session] = await pool.query('SELECT * FROM therapy_sessions WHERE id = ? AND (user_id = ? OR volunteer_id = ?) AND status = "active"', [sessionId, senderId, senderId]);
        if (!session.length) {
          socket.emit('error', { message: 'You are not part of this therapy session' });
          return;
        }

        // Save message to database
        const [result] = await pool.query(
          'INSERT INTO therapy_messages (session_id, sender_id, content, timestamp) VALUES (?, ?, ?, NOW())',
          [sessionId, senderId, message]
        );

        const messageData = {
          id: result.insertId,
          session_id: sessionId,
          sender_id: senderId,
          content: message,
          timestamp: new Date()
        };

        // Send to both participants
        io.to(`therapy_${sessionId}`).emit('receive_therapy_message', messageData);
      } catch (error) {
        console.error('Therapy message error:', error);
        socket.emit('error', { message: 'Failed to send therapy message' });
      }
    });

    // Join rooms
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('join_group', (groupId) => {
      socket.join(`group_${groupId}`);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    socket.on('join_therapy', (sessionId) => {
      socket.join(`therapy_${sessionId}`);
      console.log(`User ${socket.id} joined therapy session ${sessionId}`);
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      socket.to(data.room).emit('user_typing', { userId: socket.userId, isTyping: true });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.room).emit('user_typing', { userId: socket.userId, isTyping: false });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          await pool.query('UPDATE users SET is_online = 0 WHERE id = ?', [socket.userId]);
          console.log(`User ${socket.userId} disconnected and offline`);
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};`));
  });
};
