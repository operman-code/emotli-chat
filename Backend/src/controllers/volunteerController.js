import pool from '../config/db.js';

export const requestTherapy = async (req, res) => {
  try {
    const { topic, chatType } = req.body;
    const userId = req.user.id;
    
    // Check if user already has an active therapy session
    const [activeSession] = await pool.query('SELECT * FROM therapy_sessions WHERE user_id = ? AND status = "active"', [userId]);
    if (activeSession.length) {
      return res.status(400).json({ error: 'You already have an active therapy session' });
    }
    
    // Find available volunteer based on chat type
    let query = 'SELECT * FROM users WHERE is_volunteer = 1 AND is_online = 1';
    if (chatType) {
      query += ' AND preferred_chat_type = ?';
    }
    query += ' ORDER BY RAND() LIMIT 1';
    
    const params = chatType ? [chatType] : [];
    const [volunteers] = await pool.query(query, params);
    
    if (!volunteers.length) {
      return res.status(404).json({ error: 'No volunteers available for this chat type' });
    }

    const volunteer = volunteers[0];
    const [result] = await pool.query(
      'INSERT INTO therapy_sessions (user_id, volunteer_id, topic, chat_type, status, created_at) VALUES (?, ?, ?, ?, "active", NOW())',
      [userId, volunteer.id, topic, chatType || 'general']
    );

    res.json({ 
      message: `Connected to volunteer ${volunteer.name}`, 
      volunteer_id: volunteer.id,
      session_id: result.insertId,
      volunteer_name: volunteer.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleVolunteerStatus = async (req, res) => {
  try {
    const { status, preferredChatType } = req.body;
    const userId = req.user.id;
    
    await pool.query('UPDATE users SET is_volunteer = ?, preferred_chat_type = ?, updated_at = NOW() WHERE id = ?', 
      [status, preferredChatType || 'general', userId]);
    
    res.json({ 
      success: true, 
      message: status ? 'Volunteer mode enabled' : 'Volunteer mode disabled',
      is_volunteer: status,
      preferred_chat_type: preferredChatType || 'general'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTherapySessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    
    // Users can only see their own sessions
    if (parseInt(userId) !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const [rows] = await pool.query(
      `SELECT ts.*, u.name as volunteer_name, u.email as volunteer_email
       FROM therapy_sessions ts
       JOIN users u ON ts.volunteer_id = u.id
       WHERE ts.user_id = ?
       ORDER BY ts.created_at DESC`,
      [userId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAvailableVolunteers = async (req, res) => {
  try {
    const { chatType } = req.query;
    
    let query = 'SELECT id, name, email, preferred_chat_type, is_online FROM users WHERE is_volunteer = 1';
    const params = [];
    
    if (chatType) {
      query += ' AND preferred_chat_type = ?';
      params.push(chatType);
    }
    
    query += ' ORDER BY is_online DESC, name ASC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

