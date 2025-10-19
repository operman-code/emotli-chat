import express from 'express';
import { sendMessage, getMessages, searchUsers, sendFriendRequest, acceptFriendRequest, getFriends, getFriendRequests } from '../controllers/chatController.js';
import { profanityFilter } from '../middlewares/profanityFilter.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Message routes
router.post('/send', profanityFilter, sendMessage);
router.get('/messages/:userId/:partnerId', getMessages);

// User search and friend management
router.get('/search', searchUsers);
router.post('/friend-request', sendFriendRequest);
router.post('/friend-request/accept', acceptFriendRequest);
router.get('/friends/:userId', getFriends);
router.get('/friend-requests/:userId', getFriendRequests);

export default router;