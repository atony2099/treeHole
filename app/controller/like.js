/*
 * @Author: atony2099
 * @Date: 2018-12-13 11:43:41
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 16:59:42
 */

'use strict';

const Controller = require('egg').Controller;
const errorTips = require('../constants/api/errorTips');
const _ = require('lodash');
const { LikeError } = errorTips;

const likeRule = {
  id: { type: 'string', trim: true }
};

// 1. midi-server
// 2.
class LikeController extends Controller {
  async index() {
    const { topic: topicService, user: UserServicve, like: likeService } = this.service;
    // 1,parmetre
    const { body } = this.ctx.request;
    this.ctx.validate(likeRule, body);
    const { id: topicID, like = true } = body;
    const {
      $userInfo: { id: userID }
    } = this.ctx;

    // 2.  findTopic
    const topic = await topicService.findTopicById(topicID);
    if (!topic) {
      this.ctx.toError(404, 'topic not found');
    }
    // 3. update like
    const userLike = await likeService.findLike(topicID, userID);

    let incr;
    // 4.1 likeopus
    if (like) {
      // 已经存在
      if (userLike) {
        this.logger.debug(LikeError, '==========xxx');
        this.ctx.toSuccess(null, LikeError.HAS_LIKE, 10001);
        return;
      }

      await likeService.newAndSave(topicID, userID);
      await topicService.addLikeUserID(topicID, userID);
      incr = 1;
    } else {
      // 4.
      if (!userLike) {
        this.logger.debug(LikeError, '==========xxx');
        this.ctx.toSuccess(null, LikeError.NOT_LIKE, 10000);
        return;
      }
      await likeService.removeLike(topicID, userID);
      await topicService.removeLikeUserID(topicID, userID);
      incr = -1;
    }

    // 4.2：incre user topic
    let [topicInfo, userInfo] = await Promise.all([
      topicService.increTopicLikeCount(topicID, incr),
      UserServicve.increUserLikeCount(userID)
    ]);

    let like_id = topicInfo.like_id;
    like_id = like_id.map(ele => ele.toString());
    topicInfo.is_like = like_id.includes(userID);

    topicInfo = _.pick(topicInfo, ['_id', 'like_count', 'is_like']);
    userInfo = _.pick(userInfo, ['_id', 'like_count']);
    this.ctx.helper.renameObjcetKey(topicInfo, {
      _id: 'id'
    });
    const like_info = { topic: topicInfo, user: userInfo };

    this.ctx.toSuccess({ like_info });
  }
}

module.exports = LikeController;
