/*
 * @Author: atony2099
 * @Date: 2018-12-17 16:30:38
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-28 02:15:47
 */

'use strict';
const LikeError = {
  HAS_LIKE: '你已经喜欢该作品啦',
  NOT_LIKE: '你还没有喜欢这个作品'
};

const common = {
  NO_AUTHORIZE: '你没有权利操作',
  TOPIC_IS_DELETE: '话题已经被删除'
};

const user = {
  USER_NOT_FOUND: '用户不存在',
  USER_UNAUTH: '请重新登录',
  DECODE_ERROR: '用户信息无法正确解码'
};

module.exports = {
  LikeError,
  common,
  user
};
