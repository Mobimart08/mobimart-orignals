import { createClient } from 'redis';
import env from './env.js';

const redis = createClient({
  url: env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: false
  }
});

redis.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.warn('⚠️  Redis not running. Proceeding without caching layer.');
  } else {
    console.error('Redis Client Error', err.message);
  }
});

redis.on('connect', () => {
  console.log('Connected to Redis Cache');
});

if (process.env.NODE_ENV !== 'test') {
  redis.connect().catch((err) => {
    if (err.code !== 'ECONNREFUSED') {
      console.error(err.message);
    }
  });
}

export default redis;
