import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../prisma';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const resolveAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await prisma.alert.update({
      where: { id: String(id) },
      data: { resolved: true }
    });
    res.json(alert);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const router = Router();
router.get('/', authenticate, getAlerts);
router.patch('/:id/resolve', authenticate, resolveAlert);

export default router;
