import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendOtp, verifyOtp } from '../services/otpService.js';

export const register = async (req, res) => {
  try {
    const { email } = req.body;
    const [exists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ error: 'User already exists' });
    await sendOtp(email);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtpCode = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;
    const isValid = await verifyOtp(email, otp);
    if (!isValid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, hashed]);
    res.json({ message: 'Account verified and created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'User not found' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
