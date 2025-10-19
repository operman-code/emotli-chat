import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const register = (data) => API.post('/api/auth/register', data);
export const verifyOtp = (data) => API.post('/api/auth/verify', data);
export const login = (data) => API.post('/api/auth/login', data);
