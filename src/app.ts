import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';

export const app = express();

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
