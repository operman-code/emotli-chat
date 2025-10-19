import crypto from 'crypto';
import { transporter } from '../config/mailer.js';
import pool from '../config/db.js';

export const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await pool.query('INSERT INTO otps (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))', [email, otp]);
  await transporter.sendMail({ to: email, subject: 'Emotli OTP', text: `Your OTP is ${otp}` });
};

export const verifyOtp = async (email, code) => {
  const [rows] = await pool.query('SELECT * FROM otps WHERE email = ? AND code = ? AND expires_at > NOW()', [email, code]);
  return rows.length > 0;
};
