import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '@config/env';
import { HTTP_STATUS } from '@constants/http.constants';

/** Passthrough limiter — used when RATE_LIMIT_ENABLED=false */
const noopLimiter: RequestHandler = (_req, _res, next) => next();

export const generalLimiter = env.RATE_LIMIT_ENABLED
  ? rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many requests, please try again later.',
        errors: [],
      },
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    })
  : noopLimiter;

export const authLimiter = env.RATE_LIMIT_ENABLED
  ? rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.AUTH_RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        errors: [],
      },
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      skipSuccessfulRequests: true,
    })
  : noopLimiter;
