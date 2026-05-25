import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../prisma';

export const getRules = async (req: Request, res: Response) => {
  try {
    const rules = await prisma.automationRule.findMany();
    res.json(rules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createRule = async (req: Request, res: Response) => {
  try {
    const { condition, action } = req.body;
    const rule = await prisma.automationRule.create({
      data: { condition, action }
    });
    res.status(201).json(rule);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.automationRule.delete({ where: { id: String(id) } });
    res.json({ message: 'Rule deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const router = Router();
router.get('/', authenticate, getRules);
router.post('/', authenticate, createRule);
router.delete('/:id', authenticate, deleteRule);

export default router;
