/*
 * @Author: atony2099
 * @Date: 2019-01-24 14:09:24
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 22:05:41
 */

'use strict';

const Service = require('egg').Service;

class CommentService extends Service {
  async create(content, topic, author) {
    const { Comment } = this.ctx.model;
    const commentDoc = new Comment({
      content,
      topic,
      author
    });
    return commentDoc.save();
  }

  async findCommentsByQuery(query, sort = { create_at: 'desc' }) {
    const { Comment } = this.ctx.model;
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
    return Comment.find(query)
      .sort(sort)
      .populate(population);
  }
}

module.exports = CommentService;
