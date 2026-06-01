import { RequestHandler } from 'express';
import { notFound } from '../errors/error.js';

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(notFound(`route ${req.method} ${req.originalUrl} not found`));
};
