import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectWithRetry(retries: number = 0): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(
        `⚠️  MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries + 1}/${MAX_RETRIES})`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectWithRetry(retries + 1);
    }

    console.error('❌ MongoDB connection failed after maximum retries:', error);
    process.exit(1);
  }
}

export async function connectDB(): Promise<void> {
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('✅ MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  await connectWithRetry();
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.info('MongoDB connection closed');
}
