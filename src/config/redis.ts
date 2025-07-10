import { createClient } from 'redis';
import { ConfigService } from './config.service';

const configService = new ConfigService();
let redisClient: any;

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    // Get Redis URL from environment variables
    const redisUrl = configService.get('REDIS_URL') || 'redis://localhost:6379';

    // Create Redis client
    redisClient = createClient({
      url: redisUrl
    });

    // Handle errors
    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
    });

    // Connect to Redis
    await redisClient.connect();

    console.log('Connected to Redis at', redisUrl);
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  }
};

// Get Redis client
export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

// Get default TTL from environment variables (10 minutes = 600 seconds if not specified)
export const getDefaultTTL = (): number => {
  const ttl = configService.get('REDIS_TTL');
  return ttl ? parseInt(ttl, 10) : 600;
};

// Set value in Redis with TTL
export const setWithTTL = async (key: string, value: any, ttlSeconds?: number): Promise<void> => {
  try {
    if (!redisClient) {
      throw new Error('Redis client not initialized');
    }

    // Use provided TTL or default from environment
    const ttl = ttlSeconds || getDefaultTTL();

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl
    });
  } catch (error) {
    console.error('Error setting value in Redis:', error);
    throw error;
  }
};

// Get value from Redis
export const getValue = async (key: string): Promise<any> => {
  try {
    if (!redisClient) {
      throw new Error('Redis client not initialized');
    }

    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting value from Redis:', error);
    throw error;
  }
};

// Close Redis connection
export const closeRedisConnection = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
    }
    console.log('Closed Redis connection');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
    throw error;
  }
};
