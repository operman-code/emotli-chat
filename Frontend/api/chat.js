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

export const searchUsers = (query) => API.get(`/api/chat/search?query=${query}`);
export const sendFriendRequest = (receiverId) => API.post('/api/chat/friend-request', { receiverId });
export const acceptFriendRequest = (requestId) => API.post('/api/chat/friend-request/accept', { requestId });
export const getFriends = (userId) => API.get(`/api/chat/friends/${userId}`);
export const getFriendRequests = (userId) => API.get(`/api/chat/friend-requests/${userId}`);
export const sendMessage = (data) => API.post('/api/chat/send', data);
export const getMessages = (userId, partnerId) => API.get(`/api/chat/messages/${userId}/${partnerId}`);