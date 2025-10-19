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

export const getGroups = (userId) => API.get(`/api/groups/user/${userId}`);
export const createGroup = (data) => API.post('/api/groups/create', data);
export const addMember = (data) => API.post('/api/groups/add-member', data);
export const sendGroupMessage = (data) => API.post('/api/groups/send-message', data);
export const getGroupMessages = (groupId) => API.get(`/api/groups/messages/${groupId}`);