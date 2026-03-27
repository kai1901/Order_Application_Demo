import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import tablesRouter from './routes/tables.js';
import ordersRouter from './routes/orders.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.allowedOrigin }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/health', healthRouter);
  app.use('/api', tablesRouter);
  app.use('/api', ordersRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Sakura Order Backend is running' });
  });

  return app;
}
