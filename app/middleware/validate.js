/*
 * @Author: atony2099
 * @Date: 2018-12-10 18:55:55
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-02-12 12:53:30
 */

'use strict';
const wxconstant = require('../constants/wx_constant');

// 1. 方案- : 只进行本地cache的读取
module.exports = () => {
  return async (ctx, next) => {
    // 1.request
    const { request, service } = ctx;

    // 1. get user info
    // if (!request.get(wxconstant.WX_HEADER_FLAG)) {
    //   await next();
    //   return;
    // }
    const skey = request.query.skey || request.body.skey || request.get(wxconstant.WX_HEADER_SKEY);
    ctx.logger.info(skey, '======');
    if (skey) {
      ctx.app.logger.info(skey, 'skey=======');
      const { cache: cacheService } = service;
      let userInfo = await cacheService.get(skey);
      if (!userInfo) {
        ctx.toError(401, 'invalidated skey');
        return;
      }
      userInfo = JSON.parse(userInfo);
      ctx.$userInfo = userInfo;
      ctx.app.logger.info(userInfo, 'json======userinfo');
      await next();
      // //  判断是否在有效期内
      // const notExpired = update_at.getTime() + ctx.app.config.wxLoginExpire * 1000 - Date.now();
      // // 1. 过期
      // if (!notExpired) {
      //   ctx.toErrorResponse(401, 'invalidated skey');
      //   return;
      // }
    } else {
      ctx.toError(401, 'invalidated skey');
    }
  };
};
