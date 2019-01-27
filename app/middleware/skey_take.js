/*
 * @Author: atony2099
 * @Date: 2018-12-17 19:12:27
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 22:40:09
 */

'use strict';
const wxconstant = require('../constants/wx_constant');

// 1. 方案- : 只进行本地cache的读取
module.exports = () => {
  return async (ctx, next) => {
    // 1.request
    const { request, service } = ctx;
    // 1. get user info
    if (!request.get(wxconstant.WX_HEADER_FLAG)) {
      await next();
      return;
    }
    const skey = request.query.skey || request.body.skey || request.get(wxconstant.WX_HEADER_SKEY);

    if (skey) {
      const { cache: cacheService } = service;
      let userInfo = await cacheService.get(skey);
      userInfo = JSON.parse(userInfo);
      ctx.app.logger.debug(userInfo, '============useinfo');
      if (userInfo) {
        ctx.$userInfo = userInfo;
      }
    }
    await next();
  };
};
