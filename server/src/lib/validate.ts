import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from './errors.js';

/** Validates and REPLACES req[where] with the parsed value. */
export const validate =
  (schema: ZodSchema, where: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const r = schema.safeParse(req[where]);
    if (!r.success) return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid input', r.error.flatten()));
    (req as unknown as Record<string, unknown>)[where] = r.data;
    next();
  };

export const asyncH =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
