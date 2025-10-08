const Redis = require('ioredis');

class RedisWrapper {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.fallbackCache = new Map(); // In-memory fallback
    this.init();
  }

  init() {
    try {
      // Only connect to Redis if Redis URL is provided
      if (process.env.REDIS_URL || process.env.REDIS_HOST) {
        this.redis = new Redis({
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || null,
          retryDelayOnFailover: 100,
          enableReadyCheck: false,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          connectTimeout: 5000,
          commandTimeout: 3000
        });

        this.redis.on('connect', () => {
          console.log('✅ Redis connected successfully');
          this.isConnected = true;
        });

        this.redis.on('error', (err) => {
          console.warn('⚠️ Redis connection failed, using in-memory fallback:', err.message);
          this.isConnected = false;
        });

        this.redis.on('close', () => {
          console.warn('⚠️ Redis connection closed, using in-memory fallback');
          this.isConnected = false;
        });
      } else {
        console.log('ℹ️ Redis not configured, using in-memory fallback');
      }
    } catch (error) {
      console.warn('⚠️ Redis initialization failed, using in-memory fallback:', error.message);
    }
  }

  async set(key, value, expiry = null) {
    try {
      if (this.isConnected && this.redis) {
        if (expiry) {
          await this.redis.setex(key, expiry, value);
        } else {
          await this.redis.set(key, value);
        }
      } else {
        // Use in-memory fallback
        this.fallbackCache.set(key, {
          value,
          expiry: expiry ? Date.now() + (expiry * 1000) : null
        });
      }
    } catch (error) {
      console.warn('Redis set failed, using fallback:', error.message);
      this.fallbackCache.set(key, {
        value,
        expiry: expiry ? Date.now() + (expiry * 1000) : null
      });
    }
  }

  async get(key) {
    try {
      if (this.isConnected && this.redis) {
        return await this.redis.get(key);
      } else {
        // Use in-memory fallback
        const cached = this.fallbackCache.get(key);
        if (cached) {
          if (cached.expiry && Date.now() > cached.expiry) {
            this.fallbackCache.delete(key);
            return null;
          }
          return cached.value;
        }
        return null;
      }
    } catch (error) {
      console.warn('Redis get failed, using fallback:', error.message);
      const cached = this.fallbackCache.get(key);
      if (cached) {
        if (cached.expiry && Date.now() > cached.expiry) {
          this.fallbackCache.delete(key);
          return null;
        }
        return cached.value;
      }
      return null;
    }
  }

  async del(key) {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.del(key);
      } else {
        this.fallbackCache.delete(key);
      }
    } catch (error) {
      console.warn('Redis del failed, using fallback:', error.message);
      this.fallbackCache.delete(key);
    }
  }

  async keys(pattern) {
    try {
      if (this.isConnected && this.redis) {
        return await this.redis.keys(pattern);
      } else {
        // Simple pattern matching for fallback
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return Array.from(this.fallbackCache.keys()).filter(key => regex.test(key));
      }
    } catch (error) {
      console.warn('Redis keys failed, using fallback:', error.message);
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return Array.from(this.fallbackCache.keys()).filter(key => regex.test(key));
    }
  }

  async exists(key) {
    try {
      if (this.isConnected && this.redis) {
        return await this.redis.exists(key);
      } else {
        return this.fallbackCache.has(key) ? 1 : 0;
      }
    } catch (error) {
      console.warn('Redis exists failed, using fallback:', error.message);
      return this.fallbackCache.has(key) ? 1 : 0;
    }
  }
}

// Export singleton instance
module.exports = new RedisWrapper();
