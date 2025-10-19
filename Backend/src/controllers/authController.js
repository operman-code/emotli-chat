import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendOtp, verifyOtp } from '../services/otpService.js'export const register = async (req, res) => {
  try {
    const { email, username, phone } = req.body;
    
    // Check if email already exists
    const [emailExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailExists.length) return res.status(400).json({ error: 'Email already exists' });
    
    // Check if username already exists
    const [usernameExists] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (usernameExists.length) return res.status(400).json({ error: 'Username already exists' });
    
    // Check if phone already exists
    const [phoneExists] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (phoneExists.length) return res.status(400).json({ error: 'Phone number already exists' });
    
    // Validate username format (alphanumeric and underscores only, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' });
    }
    
    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }
    
    await sendOtp(email);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};ge });
  }export const verifyOtpCode = async (req, res) => {
  try {
    const { email, otp, username, name, phone, password } = req.body;
    const isValid = await verifyOtp(email, otp);
    if (!isValid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Double-check uniqueness before creating account
    const [emailExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailExists.length) return res.status(400).json({ error: 'Email already exists' });
    
    const [usernameExists] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (usernameExists.length) return res.status(400).json({ error: 'Username already exists' });
    
    const [phoneExists] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (phoneExists.length) return res.status(400).json({ error: 'Phone number already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, username, name, phone, password) VALUES (?, ?, ?, ?, ?)', [email, username, name, phone, hashed]);
    res.json({ message: 'Account verified and created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};essage });
  }export const login = async (req, res) => {
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

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' });
    }
    
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length) {
      return res.json({ available: false, message: 'Username is already taken' });
    }
    
    res.json({ available: true, message: 'Username is available' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};.message });
  }
};
