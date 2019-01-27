/*
 * @Author: atony2099
 * @Date: 2018-12-23 22:47:30
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 16:13:37
 */

'use strict';

module.exports = {
  renameObjcetKey(obj, keys) {
    Object.keys(keys).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (!descriptor) {
        return;
      }
      Object.defineProperty(obj, keys[key], descriptor);
      Object.keys(keys).forEach(key => {
        delete obj[key];
      });
    });
  }
};
