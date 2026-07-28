import redis from '../config/redis.js';

const withRedisFallback = async (operation, fallback = null) => {
  if (!redis.isReady) {
    return fallback;
  }

  try {
    return await operation();
  } catch (_) {
    return fallback;
  }
};

export const safeRedisGet = (key) => withRedisFallback(() => redis.get(key), null);

export const safeRedisSetEx = (key, ttlSeconds, value) =>
  withRedisFallback(() => redis.setEx(key, ttlSeconds, value));

export const safeRedisDel = (...keys) => {
  const filteredKeys = keys.filter(Boolean);
  if (filteredKeys.length === 0) {
    return Promise.resolve(0);
  }

  return withRedisFallback(() => redis.del(filteredKeys), 0);
};

export const safeRedisIncr = (key) => withRedisFallback(() => redis.incr(key), null);

export const safeRedisExpire = (key, ttlSeconds) =>
  withRedisFallback(() => redis.expire(key, ttlSeconds), 0);

export const clearUserAuthState = async (userId) => {
  if (!userId) {
    return;
  }

  await safeRedisDel(
    `user:${userId}`,
    `loginAttempts:${userId}`,
    `loginLock:${userId}`
  );
};
