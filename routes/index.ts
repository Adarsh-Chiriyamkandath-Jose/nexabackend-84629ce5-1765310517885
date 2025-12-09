import express from 'express';
import { router as healthRouter } from './health';
import { router as ordersRouter } from './orders';
import { router as paymentsRouter } from './payments';
import { router as productsRouter } from './products';

export const router = express.Router();

// Mount all route modules
router.use('/health', healthRouter);
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/products', productsRouter);
