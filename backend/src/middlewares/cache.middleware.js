import redis from '../config/redis.js';

/**
 * Express middleware to cache HTTP responses using Redis.
 * @param {number} duration - Cache expiration time in seconds (default 300s = 5m).
 */
export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if redis isn't connected
    if (!redis || !redis.isReady) {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedBody = await redis.get(key);

      if (cachedBody) {
        // Return cached response
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(cachedBody);
      } else {
        // Override res.send to intercept the response payload
        const originalSend = res.send;
        res.send = function (body) {
          // Only cache successful JSON responses
          if (res.statusCode === 200) {
            redis.set(key, body, { EX: duration }).catch((err) => {
              console.error('Redis Set Error:', err);
            });
          }
          originalSend.call(this, body);
        };
        next();
      }
    } catch (err) {
      console.error('Redis Cache Error:', err);
      next();
    }
  };
};

export const clearCacheMatch = async (pattern) => {
  if (!redis || !redis.isReady) return;
  try {
    const keys = await redis.keys(`__express__${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    console.error('Redis Clear Cache Error:', err);
  }
};
