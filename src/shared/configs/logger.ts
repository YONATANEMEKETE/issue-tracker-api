import pino from 'pino';
import { config } from './env.js';

export const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'body.password',
    'body.token',
  ],
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});
