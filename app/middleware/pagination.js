/*
 * @Author: atony2099
 * @Date: 2018-12-15 12:22:51
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-21 19:07:21
 */

'use strict';
module.exports = () => {
  return async (ctx, next) => {
    let { currentPage = 0, pageSize = 10 } = ctx.query;
    currentPage = parseInt(currentPage) || 0;
    pageSize = parseInt(pageSize) || 10;

    const skip = currentPage * pageSize;
    const limit = pageSize;

    ctx.pagination = { skip, limit, currentPage };
    await next();
  };

};
