import express from 'express';
import { requestTherapy, toggleVolunteerStatus, getTherapySessions, getAvailableVolunteers } from '../controllers/volunteerController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Therapy and volunteer management
router.post('/request-therapy', requestTherapy);
router.post('/toggle-status', toggleVolunteerStatus);
router.get('/sessions/:userId', getTherapySessions);
router.get('/available', getAvailableVolunteers);

export default router;