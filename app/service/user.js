/*
 * @Author: atony2099
 * @Date: 2018-12-02 23:34:25
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 22:40:38
 */

'use strict';
const Service = require('egg').Service;
const uuidGenerator = require('uuid/v4');
const _ = require('lodash');

class UserService extends Service {
  async requestUserSession(code) {
    let res = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      data: {
        appid: this.config.wechatID,
        secret: this.config.wechatSecret,
        js_code: code
      },
      // telling HttpClient to process the return body as JSON format explicitly
      dataType: 'json'
    });

    res = res.data;
    this.logger.debug(res, '==========', code);
    if (res.errcode || !res.openid || !res.session_key) {
      throw new Error('ERR_GET_SESSION_KEY');
    } else {
      return res;
    }
  }

  async saveUserInfo(user_info, skey, session_key) {
    // 1.

    const uuid = uuidGenerator();
    const { gender, nickName, openId: open_id, avatarUrl: avatar_url } = user_info;
    this.logger.debug(user_info, 'current-userinfo');
    user_info = JSON.stringify(user_info);
    // const update_at = new
    return this.ctx.model.User.create({
      open_id,
      uuid,
      skey,
      session_key,
      user_info,
      nickName,
      gender,
      avatar_url
    });
  }

  async findAndUpdateUser(open_id, userInfo, skey, session_key) {
    let user = {};
    if (userInfo) {
      const { gender, nickName, avatarUrl: avatar_url } = userInfo;
      user = Object.assign(user, {
        gender,
        nickName,
        avatar_url
      });
    }
    const update_at = new Date();
    const updateInfo = Object.assign(user, {
      skey,
      session_key,
      update_at
    });

    const options = {
      new: true
    };
    return this.ctx.model.User.findOneAndUpdate(
      {
        open_id
      },
      updateInfo,
      options
    ).exec();
  }

  async findOneUserByQuery(query) {
    const { User } = this.ctx.model;
    return User.findOne(query);
  }

  async increUserLikeCount(id, number = 1) {
    const { User } = this.ctx.model;
    const options = {
      new: true
    };
    return User.findOneAndUpdate(
      {
        _id: id
      },
      {
        $inc: {
          like_count: number
        }
      },
      options
    ).exec();
  }

  async increUserTopicCount(id, number = 1) {
    const { User } = this.ctx.model;
    const options = {
      new: true
    };
    return User.findOneAndUpdate(
      {
        _id: id
      },
      {
        $inc: {
          topic_count: number
        }
      },
      options
    ).exec();
  }
}

module.exports = UserService;
