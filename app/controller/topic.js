/*
 * @Author: atony2099
 * @Date: 2018-12-13 11:43:41
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-02-12 12:40:04
 */

'use strict';
const Controller = require('egg').Controller;
const _ = require('lodash');
const errorTips = require('../constants/api/errorTips');
const { common } = errorTips;

const HOST_TOPIC_KEY = 'HOST_TOPIC_KEY';
const mongoID = {
  type: 'string',
  format: /^[0-9a-f]{24}$/i
};
const publishRule = {
  content: {
    type: 'string',
    trim: true
  }
};
const deleteRule = {
  id: mongoID
};

const topicRule = {
  id: mongoID
};

class TopicController extends Controller {
  async index() {
    const { topic: topicService } = this.service;
    const { query } = this.ctx.request;

    const topic = await topicService.findTopicById(query.id);
    this.ctx.toSuccess({
      topic
    });
  }

  async list() {
    const { topic: topicService } = this.service;
    const {
      pagination: { skip, limit, currentPage: requestPage }
    } = this.ctx;
    const { $userInfo = {} } = this.ctx;
    this.logger.debug($userInfo, '=======userinfo');
    const { id: userID } = $userInfo;

    let list = await topicService.findTopicList(skip, limit);

    list = this.transformList(list, userID);

    const totalCount = await topicService.getAllTopicCount();
    let hasMore = true;
    if (skip + list.length >= totalCount) {
      hasMore = false;
    }
    const currentPage = hasMore ? requestPage + 1 : requestPage;

    const pagination = {
      currentPage,
      totalCount,
      hasMore
    };
    this.ctx.toSuccess({
      list,
      pagination
    });
  }

  transformList(list, userID) {
    return list.map(item => {
      let { like_id } = item;
      like_id = like_id.map(ele => {
        this.logger.debug('objectid', ele);
        return ele.toString();
      });
      item = item.toObject();
      let is_like = false;
      if (!userID) {
        is_like = false;
      } else {
        if (like_id.includes(userID)) {
          is_like = true;
        } else {
          is_like = false;
        }
      }
      item.is_like = is_like;
      delete item.like_id;

      this.ctx.helper.renameObjcetKey(item, {
        _id: 'id'
      });

      this.ctx.helper.renameObjcetKey(item.author, {
        _id: 'id'
      });
      this.logger.debug(item.id, 'transform====');
      return item;
    });
  }

  async create() {
    const { topic: topicService, user: userService, cache: cacheService } = this.service;
    // 1. 参数验证
    const { body } = this.ctx.request;
    const { $userInfo } = this.ctx;
    this.logger.info(body, 'out---body', $userInfo);
    this.ctx.validate(publishRule, body);

    // 2.saveTopic
    const { content } = body;
    const { id } = $userInfo;
    await topicService.saveTopic(content, id);
    await userService.increUserTopicCount(id);

    const uniqueIp = this.ctx.createDateIp();
    this.logger.debug(uniqueIp, 'unique-ip');
    cacheService.incrKey(uniqueIp);

    this.ctx.toSuccess({});
  }

  async delete() {
    const {
      $userInfo,
      request: { body },
      service: { topic: topicService }
    } = this.ctx;
    this.ctx.validate(deleteRule, body);
    const { id: topicID } = body;

    const { topic, user } = await topicService.findTopicAndAuthorById(topicID);
    if (!topic) {
      this.toError(404, common.TOPIC_IS_DELETE);
    }

    this.logger.debug(user, $userInfo.id, 'delete====');
    if (!user || user._id.toString() !== $userInfo.id) {
      this.ctx.toError(403, common.NO_AUTHORIZE);
      return;
    }

    topic.deleted = true;
    user.topic_count -= 1;

    await Promise.all([topic.save(), user.save()]);
    const info = {
      topic_id: topic._id
    };
    this.ctx.toSuccess(info);
  }

  async hotest() {
    //
    const { $userInfo = {} } = this.ctx;
    const { topic: topicS, cache: cacheS } = this.ctx.service;
    const { id: userID } = $userInfo;

    // 1. cache
    let hotestTopic = await cacheS.get(HOST_TOPIC_KEY);
    if (hotestTopic) {
      hotestTopic = JSON.parse(hotestTopic);
    }

    // 2.db
    if (!hotestTopic) {
      hotestTopic = await topicS.findTopicList(0, 10, {
        reply_count: 'desc',
        like_count: 'desc',
        create_at: 'desc'
      });
      hotestTopic = this.transformList(hotestTopic, userID);
      await cacheS.setKey(HOST_TOPIC_KEY, JSON.stringify(hotestTopic), 60);
    }

    this.ctx.toSuccess({
      list: hotestTopic,
      pagination: {
        currentPage: 0,
        hasMore: false,
        totalCount: hotestTopic.length
      }
    });
  }
}

module.exports = TopicController;
