import express from 'express';
import { createGroup, addMember, getGroups, getGroupMessages, sendGroupMessage } from '../controllers/groupController.js';
import { profanityFilter } from '../middlewares/profanityFilter.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Group management
router.post('/create', createGroup);
router.post('/add-member', addMember);
router.get('/user/:userId', getGroups);

// Group messaging
router.post('/send-message', profanityFilter, sendGroupMessage);
router.get('/messages/:groupId', getGroupMessages);

export default router;