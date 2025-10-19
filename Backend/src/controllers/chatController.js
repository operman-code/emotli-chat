import pool from '../config/db.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;
    
    // Check if users are friends
    const [friendship] = await pool.query(
      'SELECT * FROM friendships WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?) AND status = "accepted"',
      [senderId, receiverId, receiverId, senderId]
    );
    
    if (!friendship.length) {
      return res.status(403).json({ error: 'You can only message friends' });
    }

    await pool.query('INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())', [senderId, receiverId, message]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const [rows] = await pool.query(
      'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) ORDER BY m.timestamp ASC',
      [userId, partnerId, partnerId, userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;
    
    const [rows] = await pool.query(
      'SELECT id, username, name, email, phone, is_volunteer, is_online FROM users WHERE (username LIKE ? OR name LIKE ? OR email LIKE ?) AND id != ? LIMIT 20',
      [`%${query}%`, `%${query}%`, `%${query}%`, currentUserId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if request already exists
    const [existing] = await pool.query(
      'SELECT * FROM friendships WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [senderId, receiverId, receiverId, senderId]
    );
    
    if (existing.length) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    await pool.query('INSERT INTO friendships (user1_id, user2_id, status) VALUES (?, ?, "pending")', [senderId, receiverId]);
    res.json({ success: true, message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;
    
    const [result] = await pool.query(
      'UPDATE friendships SET status = "accepted" WHERE id = ? AND user2_id = ? AND status = "pending"',
      [requestId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Friend request not found or already processed' });
    }
    
    res.json({ success: true, message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.is_volunteer, f.status, f.created_at
       FROM friendships f
       JOIN users u ON (f.user1_id = u.id OR f.user2_id = u.id)
       WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ? AND f.status = "accepted"
       ORDER BY f.created_at DESC`,
      [userId, userId, userId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.query(
      `SELECT f.id, f.status, f.created_at, u.id as sender_id, u.name as sender_name, u.email as sender_email
       FROM friendships f
       JOIN users u ON f.user1_id = u.id
       WHERE f.user2_id = ? AND f.status = "pending"
       ORDER BY f.created_at DESC`,
      [userId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

