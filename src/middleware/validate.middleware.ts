import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';

export const validate =
  (schema: z.ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues ?? [];
        const errors = issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
