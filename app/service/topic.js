/*
 * @Author: atony2099
 * @Date: 2018-12-13 15:47:45
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-28 02:15:39
 */

'use strict';

const Service = require('egg').Service;

class TopicService extends Service {
  async saveTopic(content, author) {
    const { Topic } = this.ctx.model;
    const topic = {
      content,
      author
    };
    const topicDoc = new Topic(topic);
    await topicDoc.save();
  }

  async findTopicById(id) {
    const { Topic } = this.ctx.model;
    const population = {
      path: 'author',
      model: 'User',
      select: {
        create_at: 0,
        session_key: 0,
        user_info: 0,
        open_id: 0,
        skey: 0,
        uuid: 0,
        update_at: 0
      }
    };
    return Topic.findOne({ _id: id }).populate(population);
  }

  // 搜索与话题相关
  async findTopicAndAuthorById(topicId) {
    const { Topic } = this.ctx.model;
    const topic = await Topic.findOne({ _id: topicId });
    const user = await this.service.user.findOneUserByQuery({
      _id: topic.author
    });
    return {
      topic,
      user
    };
  }

  async findTopicList(skip, limit, sort = { update_at: 'desc' }) {
    const { Topic } = this.ctx.model;
    const query = { deleted: false };
    const projection = {
      deleted: 0,
      create_at: 0
    };
    const population = {
      path: 'author',
      model: 'User',
      select: {
        create_at: 0,
        session_key: 0,
        user_info: 0,
        open_id: 0,
        skey: 0,
        uuid: 0,
        update_at: 0
      }
    };

    const options = {
      sort,
      limit,
      skip
    };
    const topics = await Topic.find(query, projection, options)
      .populate(population)
      .exec();
    return topics.filter(topic => !!topic.author);
  }

  async getAllTopicCount() {
    const { Topic } = this.ctx.model;
    return Topic.count({ deleted: false });
  }

  async increTopicLikeCount(id, degree = 1) {
    const { Topic } = this.ctx.model;
    const options = { new: true };
    return Topic.findOneAndUpdate({ _id: id }, { $inc: { like_count: degree } }, options).exec();
  }

  async increTopicCommentCount(id, degree = 1) {
    const { Topic } = this.ctx.model;
    const options = { new: true };
    return Topic.findOneAndUpdate({ _id: id }, { $inc: { reply_count: degree }, options }).exec();
  }

  async addLikeUserID(topicID, userID) {
    const { Topic } = this.ctx.model;
    return Topic.update({ _id: topicID }, { $addToSet: { like_id: userID } });
  }

  async removeLikeUserID(topicID, userID) {
    const { Topic } = this.ctx.model;
    return Topic.update({ _id: topicID }, { $pull: { like_id: userID } });
  }
}

module.exports = TopicService;
