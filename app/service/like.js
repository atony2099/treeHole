/*
 * @Author: atony2099
 * @Date: 2018-12-17 14:48:25
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-17 15:31:49
 */


'use strict';

const Service = require('egg').Service;

class LikeService extends Service {
  async newAndSave(topic_id, user_id) {
    const { Like } = this.ctx.model;
    const like = new Like({ topic_id, user_id });
    return like.save();
  }

  async removeLike(topic_id, user_id) {
    const { Like } = this.ctx.model;
    return Like.deleteOne({ topic_id, user_id });
  }

  async findLike(topic_id, user_id) {
    const { Like } = this.ctx.model;
    return Like.findOne({ topic_id, user_id });
  }


}

module.exports = LikeService;

