import { Router } from 'express';
import { getCurrentSensors, getSensorHistory, getAnalytics } from '../controllers/sensor.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/current', authenticate, getCurrentSensors);
router.get('/history/:sensorId', authenticate, getSensorHistory);
router.get('/analytics', authenticate, getAnalytics);

export default router;
