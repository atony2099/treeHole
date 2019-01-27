/*
 * @Author: atony2099
 * @Date: 2018-12-02 01:17:25
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 19:40:01
 */

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/api')(app);
};
