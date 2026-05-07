/// <reference path="./types/express.d.ts" />
import { env } from '@config/env';
import { connectDB, disconnectDB } from '@config/db';
import app from './app';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    console.info(`📖 API Docs: http://localhost:${PORT}/api/docs`);
    console.info(`❤️  Health:  http://localhost:${PORT}/health`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.info(`\n${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      console.info('HTTP server closed');
      await disconnectDB();
      console.info('All connections closed. Process exiting.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    server.close(() => process.exit(1));
  });
}

void startServer();
