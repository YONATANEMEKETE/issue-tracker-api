import { pinoHttp } from 'pino-http';
import { logger } from '../configs/logger.js';
import { randomUUID } from 'crypto';

export const requestLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const id = req.headers['x-request-id'] ?? randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  autoLogging: {
    ignore(req) {
      return req.url === '/health';
    },
  },
  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
