import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
