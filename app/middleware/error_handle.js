/*
 * @Author: atony2099
 * @Date: 2018-12-02 17:31:23
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-12 11:56:59
 */

'use strict';
module.exports = (options, app) => {

  return async function(ctx, next) {
    try {
      await next();
    } catch (error) {
      app.logger.debug('error', error);
      app.emit('error', error, this);
      // 1.
      const status = error.status || 500;
      let errorDetail;
      if (error.status === 422 && error.errors) {
        app.logger.debug('catch-detail', error.errors);
        errorDetail = error.errors;
      }
      ctx.toError(status, error.message, errorDetail);
    }
  };


};
