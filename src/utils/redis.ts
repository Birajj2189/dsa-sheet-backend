import Redis from 'ioredis';
import { env } from '@config/env';

const redisConfig = {
  host: env.REDIS_HOST || '127.0.0.1',
  port: Number(env.REDIS_PORT) || 6379,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
};

let isRedisConnected = false;

export const redis = new Redis({
  ...redisConfig,
  lazyConnect: true,
  maxRetriesPerRequest: 0, // Fail fast for individual requests
});

redis.on('connect', () => {
  isRedisConnected = true;
  console.log('✅ Successfully connected to Redis');
});

redis.on('error', (err: any) => {
  isRedisConnected = false;
  if (err.code === 'ECONNREFUSED') {
    // Silent error for connection refused to avoid log spam in dev
    return;
  }
  console.error('Redis error:', err);
});

export const isCacheAvailable = () => isRedisConnected && env.REDIS_CACHE_ENABLED;

export const CACHE_TTL = {
  DASHBOARD: 60 * 5, // 5 minutes
  USER_PROFILE: 60 * 15, // 15 minutes
  TOPICS: 60 * 60, // 1 hour
};

export const getCacheKey = {
  dashboard: (userId: string) => `dashboard:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  topics: () => 'topics:all',
};
