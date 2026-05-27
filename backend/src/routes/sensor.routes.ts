import { Router } from 'express';
import { getCurrentSensors, getSensorHistory, getAllHistory, getAnalytics } from '../controllers/sensor.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/current', authenticate, getCurrentSensors);
router.get('/history', authenticate, getAllHistory);
router.get('/history/:sensorId', authenticate, getSensorHistory);
router.get('/analytics', authenticate, getAnalytics);

export default router;