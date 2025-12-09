import express, { Request, Response } from 'express';
import prisma from '../../utils/db';
import { z } from 'zod';

export const router = express.Router();

const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const order = await prisma.order.create({
      data: {
        userId: parsed.data.userId,
        items: {
          create: parsed.data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
    res.status(201).json({ data: order });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});