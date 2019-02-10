/*
 * @Author: atony2099
 * @Date: 2018-12-01 23:28:04
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-02-11 00:03:18
 */

'use strict';

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose'
};

exports.validate = {
  enable: true,
  package: 'egg-validate'
};

exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus'
};

exports.redis = {
  enable: true,
  package: 'egg-redis'
};

exports.alinode = {
  enable: true,
  package: 'egg-alinode',
  env: ['prod']
};
