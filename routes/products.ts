import express, { Request, Response } from 'express';
import prisma from '../../utils/db';
import { z } from 'zod';

export const router = express.Router();

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const product = await prisma.product.create({ data: parsed.data });
    res.status(201).json({ data: product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});