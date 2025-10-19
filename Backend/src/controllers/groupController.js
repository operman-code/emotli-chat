import pool from '../config/db.js';

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const adminId = req.user.id;
    
    const [result] = await pool.query('INSERT INTO groups (name, description, admin_id, created_at) VALUES (?, ?, ?, NOW())', [name, description, adminId]);
    
    // Add creator as member
    await pool.query('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())', [result.insertId, adminId]);
    
    res.json({ groupId: result.insertId, message: 'Group created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;
    const adminId = req.user.id;
    
    // Check if user is admin
    const [group] = await pool.query('SELECT admin_id FROM groups WHERE id = ?', [group_id]);
    if (!group.length || group[0].admin_id !== adminId) {
      return res.status(403).json({ error: 'Only group admin can add members' });
    }
    
    // Check if user is already a member
    const [existing] = await pool.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [group_id, user_id]);
    if (existing.length) {
      return res.status(400).json({ error: 'User is already a member' });
    }
    
    await pool.query('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())', [group_id, user_id]);
    res.json({ success: true, message: 'Member added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.query(
      `SELECT g.*, u.name as admin_name
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.admin_id = u.id
       WHERE gm.user_id = ?
       ORDER BY g.created_at DESC`,
      [userId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { group_id, message } = req.body;
    const senderId = req.user.id;
    
    // Check if user is member of group
    const [membership] = await pool.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [group_id, senderId]);
    if (!membership.length) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }
    
    await pool.query('INSERT INTO group_messages (group_id, sender_id, content, timestamp) VALUES (?, ?, ?, NOW())', [group_id, senderId, message]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    // Check if user is member of group
    const [membership] = await pool.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);
    if (!membership.length) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }
    
    const [rows] = await pool.query(
      `SELECT gm.*, u.name as sender_name
       FROM group_messages gm
       JOIN users u ON gm.sender_id = u.id
       WHERE gm.group_id = ?
       ORDER BY gm.timestamp ASC`,
      [groupId]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};message });
  }
};
