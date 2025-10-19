import pool from '../config/db.js';

export const createGroup = async (req, res) => {
  try {
    const { name, admin_id } = req.body;
    const [result] = await pool.query('INSERT INTO groups (name, admin_id) VALUES (?, ?)', [name, admin_id]);
    res.json({ groupId: result.insertId, message: 'Group created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;
    await pool.query('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', [group_id, user_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
