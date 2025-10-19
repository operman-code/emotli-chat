import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Add request interceptor to include token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const requestTherapy = (data) => API.post('/api/volunteer/request-therapy', data);
export const toggleVolunteerStatus = (data) => API.post('/api/volunteer/toggle-status', data);
export const getTherapySessions = (userId) => API.get(`/api/volunteer/sessions/${userId}`);
export const getAvailableVolunteers = (chatType) => {
  const url = chatType ? `/api/volunteer/available?chatType=${chatType}` : '/api/volunteer/available';
  return API.get(url);
};