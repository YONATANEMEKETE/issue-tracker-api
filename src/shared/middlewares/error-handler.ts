import type { ErrorRequestHandler } from 'express';
import { isAppError } from '../errors/error.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const appError = isAppError(err) ? err : undefined;
  const statusCode = appError ? appError.statusCode : 500;
  const code = appError ? appError.code : 'INTERNAL_SERVER_ERROR';
  const message = appError ? appError.message : 'An unexpected error occurred';
  const details = appError?.details;

  req.log.error({ err }, 'request failed');

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
};
