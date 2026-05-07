import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DSA Sheet API',
      version: '1.0.0',
      description:
        'Production-ready REST API for the DSA Sheet web application. Supports authentication, topic management, problem tracking, progress, bookmarks, notes, and dashboard analytics.',
      contact: {
        name: 'DSA Sheet Team',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Development server',
      },
      {
        url: 'https://api.dsasheet.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            streak: { type: 'number' },
            xp: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Problem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            tags: { type: 'array', items: { type: 'string' } },
            leetcodeLink: { type: 'string' },
            estimatedTime: { type: 'number' },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
