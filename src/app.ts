import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { env } from '@config/env';
import { swaggerSpec } from '@config/swagger';
import { generalLimiter } from '@middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from '@middleware/error.middleware';
import apiRoutes from '@routes/index';

const app: Application = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

if (env.RATE_LIMIT_ENABLED) {
  app.use('/api', generalLimiter);
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'DSA Sheet API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'DSA Sheet API Docs',
  }),
);

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
