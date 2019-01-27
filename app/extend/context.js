/*
 * @Author: atony2099
 * @Date: 2018-12-02 17:57:50
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-04 00:24:17
 */


'use strict';
const crypto = require('crypto');
const moment = require('moment');

module.exports = {
  toError(code, message, detail) {
    this.status = code || 500;
    const error_msg = this.status === 500 && this.app.config.env === 'pro' ? 'internal server error' : message;
    this.body = { error_msg };
    if (detail) {
      this.body.error_detail = detail;
    }
  },

  // 10001:has exits
  // 10000:其他错误
  toSuccess(info, error_msg, error_code = 0) {
    this.body = {
      error_code,
    };
    if (info) {
      this.body.data = info;
    }
    if (error_msg) {
      this.body.error_msg = error_msg;
    }
  },


  createHash(message) {
    return crypto.createHash('sha1').update(message, 'uft8').digest('hex');
  },
  createDateIp() {
    const date = moment().format('YYYY-MM-DD');
    return `${date}-${this.ip}`;
  },


};
