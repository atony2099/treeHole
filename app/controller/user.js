/*
 * @Author: atony2099
 * @Date: 2018-12-02 00:42:46
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 23:08:12
 */

'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
const errorTips = require('../constants/api/errorTips');

const loginrule = {
  code: 'string',
  encryptedData: {
    type: 'string',
    required: false
  },
  iv: {
    type: 'string',
    required: false
  }
};

const userRule = {
  skey: 'string'
};

class UserController extends Controller {
  async login() {
    const { body } = this.ctx.request;
    const { user: userService, code: codeService, cache: cacheService } = this.service;

    // 1. parameter
    this.ctx.validate(loginrule, body);
    const { code, encryptedData, iv } = body;

    // 2 .decode user
    const { session_key, openid } = await userService.requestUserSession(code);
    const skey = this.ctx.createHash(session_key);

    // 3.
    const originUser = await userService.findOneUserByQuery({
      open_id: openid
    });

    let newUserInfo;
    if (iv && encryptedData) {
      newUserInfo = codeService.decodeUser(session_key, iv, encryptedData);
    }

    let saveUser;
    // 4.
    if (originUser) {
      // 4.1 not first login
      saveUser = await userService.findAndUpdateUser(openid, newUserInfo, skey, session_key);
      const { skey: originSkey } = originUser;
      this.logger.debug(originSkey, 'origin skey', skey, 'currentkey');
      await cacheService.deleteKey(originSkey);
      this.logger.debug('update===', saveUser);
    } else {
      // 4.2 first login, must have userinfo
      if (!newUserInfo) {
        this.ctx.toError(400, errorTips.user.DECODE_ERROR);
        return;
      }
      saveUser = await userService.saveUserInfo(newUserInfo, skey, session_key);
    }

    const toUser = _.pick(saveUser, [
      'skey',
      'nickName',
      'avatarUrl',
      'gender',
      '_id',
      'like_count',
      'topic_count',
      'avatar_url'
    ]);
    this.ctx.helper.renameObjcetKey(toUser, {
      _id: 'id'
    });
    await cacheService.setKey(skey, JSON.stringify(toUser), this.config.wxLoginExpire);
    this.ctx.toSuccess({
      user: toUser
    });
  }

  async getUser() {
    const { query } = this.ctx.request;
    const {
      service: { user: userService }
    } = this;

    // 1. validate
    this.ctx.validate(userRule, query);
    const { skey } = query;

    // 2. find;
    let user = await userService.findOneUserByQuery({
      skey
    });

    if (!user) {
      this.ctx.toError(401, errorTips.user.USER_UNAUTH);
    }
    user = _.pick(user, [
      'nickName',
      'avatarUrl',
      'gender',
      '_id',
      'like_count',
      'topic_count',
      'avatar_url'
    ]);
    this.ctx.helper.renameObjcetKey(user, {
      _id: 'id'
    });

    const info = {
      user
    };
    this.ctx.toSuccess(info);
  }

  async getMeInfo() {
    // 1.
    const { $userInfo } = this.ctx;
    if (!($userInfo && $userInfo.skey)) {
      this.ctx.toError(401, errorTips.user.USER_UNAUTH);
    }
    let user = await this.service.user.findOneUserByQuery({
      skey: $userInfo.skey
    });
    user = this.pickUser(user);
    this.ctx.toSuccess({
      user
    });
  }

  pickUser(user) {
    const pickedUse = _.pick(user, [
      'nickName',
      'avatarUrl',
      'gender',
      '_id',
      'like_count',
      'topic_count',
      'avatar_url'
    ]);
    this.ctx.helper.renameObjcetKey(pickedUse, {
      _id: 'id'
    });
    return pickedUse;
  }
}

module.exports = UserController;
