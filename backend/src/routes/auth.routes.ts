import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
