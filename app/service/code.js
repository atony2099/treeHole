/*
 * @Author: atony2099
 * @Date: 2018-12-05 00:42:24
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-17 12:31:22
 */

'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class CodeService extends Service {
  decodeUser(key, iv, crypted) {
    this.logger.debug('key:', key, 'iv:', iv, 'crypted:', crypted, 'decodeUser====');
    crypted = new Buffer(crypted, 'base64');
    key = new Buffer(key, 'base64');
    iv = new Buffer(iv, 'base64');
    let decoded;
    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      decipher.setAutoPadding(true);
      decoded = decipher.update(crypted, 'base64', 'utf8');
      decoded += decipher.final('utf8');
      decoded = JSON.parse(decoded);
    } catch (e) {
      throw e;
    }

    if (decoded.watermark.appid !== this.config.wechatID) {
      throw new Error('Illegal Buffer');
    }

    return decoded;
  }
}

module.exports = CodeService;
