import pool from '../config/db.js';

export const requestTherapy = async (req, res) => {
  try {
    const { user_id, topic } = req.body;
    const [volunteers] = await pool.query('SELECT * FROM users WHERE is_volunteer = 1 ORDER BY RAND() LIMIT 1');
    if (!volunteers.length) return res.status(404).json({ error: 'No volunteers available' });

    const volunteer = volunteers[0];
    await pool.query('INSERT INTO therapy_sessions (user_id, volunteer_id, topic, status) VALUES (?, ?, ?, ?)',
      [user_id, volunteer.id, topic, 'active']);

    res.json({ message: `Connected to volunteer ${volunteer.name}`, volunteer_id: volunteer.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleVolunteerStatus = async (req, res) => {
  try {
    const { user_id, status } = req.body;
    await pool.query('UPDATE users SET is_volunteer = ? WHERE id = ?', [status, user_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
