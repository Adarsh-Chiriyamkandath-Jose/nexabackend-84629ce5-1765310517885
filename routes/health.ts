import express, { Request, Response } from 'express';

export const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
