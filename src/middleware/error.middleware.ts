import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { env } from '@config/env';

interface ErrorResponse {
  success: false;
  message: string;
  errors: unknown[];
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errors: unknown[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value as string}`;
  } else if ((err as NodeJS.ErrnoException).code === '11000') {
    statusCode = HTTP_STATUS.CONFLICT;
    const mongoErr = err as { keyValue?: Record<string, unknown> };
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
    message = `Duplicate value for ${field}. Please use a different value.`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token has expired';
  }

  const response: ErrorResponse = {
    success: false,
    message,
    errors,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`));
}
