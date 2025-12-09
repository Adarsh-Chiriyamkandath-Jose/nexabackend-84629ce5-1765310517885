import express from 'express';
import cors from 'cors';
import { router as healthRouter } from '../routes/health';
import { router as apiRouter } from '../routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'NexaBackend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments'
    },
    documentation: 'Visit /api/health for service status'
  });
});

// Health check
app.use('/api/health', healthRouter);

// API routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
