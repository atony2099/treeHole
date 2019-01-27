/*
 * @Author: atony2099
 * @Date: 2018-12-14 16:41:19
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-14 19:05:57
 */

'use strict';


module.exports = (_, app) => {

  // 1. 思路=== 生成一个
  return async (ctx, next) => {

    // 生成
    const key = ctx.createDateIp();
    const { cache } = ctx.service;
    let count = await cache.get(key);
    count = parseInt(count) || 0;
    app.logger.debug(count, 'current====count');
    if (count >= app.config.createLimitCount) {
      ctx.toError(403, `发布已达到最大限制${app.config.createLimitCount}`);
      return;
    }
    await next();

  };

}
;
