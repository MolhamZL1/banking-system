import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from '../../application/errors/http-error';

export const validateBody =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, JSON.stringify(parsed.error.issues)));
    }

    req.body = parsed.data;
    next();
  };
