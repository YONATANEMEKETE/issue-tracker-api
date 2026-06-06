import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate and parse the body (overwrites req.body with parsed/stripped fields)
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validate and parse the query parameters
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }

      // Validate and parse the route params
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }

      next();
    } catch (error) {
      // ZodError is thrown automatically and caught here.
      // Next(error) forwards it to our global errorHandler which we configured earlier!
      next(error);
    }
  };
};
