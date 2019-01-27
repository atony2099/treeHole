/*
 * @Author: atony2099
 * @Date: 2018-12-11 16:09:39
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-14 17:10:54
 */

'use strict';

const Service = require('egg').Service;

class CacheService extends Service {

  async get(key) {
    const {
      redis,
      logger,
    } = this.app;
    const t = Date.now();
    const data = await redis.get(key);
    const duration = Date.now() - t;
    logger.debug('Cache', 'get', key, (duration + 'ms'));
    return data;
  }


  async setKey(key, value, expire) {
    const {
      redis,
      logger,
    } = this.app;
    const t = Date.now();
    await redis.set(key, value);
    if (expire > 0) {
      await redis.expire(key, expire);
    }
    const duration = Date.now() - t;
    logger.debug('Cache', 'set', key, (duration + 'ms'));
  }
  async incrKey(key) {
    const {
      redis,
      logger,
    } = this.app;
    const t = Date.now();
    await redis.incr(key);
    const duration = Date.now() - t;
    logger.debug('Cache', 'set', key, (duration + 'ms'));
  }

  async deleteKey(key) {
    const {
      redis,
      logger,
    } = this.app;
    const t = Date.now();
    await redis.del(key);
    const duration = Date.now() - t;
    logger.debug('Cache', 'set', key, (duration + 'ms'));
  }

}

module.exports = CacheService;
