import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFoundHandler } from './shared/middlewares/notfound-handler.js';

export const app = express();

app.use(requestLogger);
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);
