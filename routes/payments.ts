import express, { Request, Response } from 'express';
import prisma from '../../utils/db';
import { z } from 'zod';

export const router = express.Router();

const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  amount: z.number().positive(),
  status: z.string().min(1).max(50),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const payment = await prisma.payment.create({
      data: parsed.data,
    });
    res.status(201).json({ data: payment });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create payment' });
  }
});