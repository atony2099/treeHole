/*
 * @Author: atony2099
 * @Date: 2018-12-20 16:04:31
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 23:08:27
 */

'use strict';

const Controller = require('egg').Controller;

const createRule = {
  comment: { type: 'string', trim: true },
  topicID: { type: 'string', format: /^[0-9a-z]{24}$/i }
};

const listRule = {
  id: { type: 'string', format: /^[0-9a-z]{24}$/i }
};

// content
class CommentController extends Controller {
  async list() {
    const { query } = this.ctx;
    this.ctx.validate(listRule, query);
    const { comment: commentS } = this.ctx.service;
    const { ObjectId } = this.app.mongoose.Types;
    const comments = await commentS.findCommentsByQuery({
      topic: new ObjectId(query.id)
    });

    // console.log(list);
    this.ctx.toSuccess({
      comments
    });
  }

  async create() {
    // 1. validate
    const { body } = this.ctx.request;
    this.ctx.validate(createRule, body);
    let { comment, topicID } = body;
    comment = this.ctx.helper.escape(comment);

    this.logger.debug(this.ctx.$userInfo._id, 'USER====');
    const { id } = this.ctx.$userInfo;

    const { comment: commentS, topic: topicS } = this.service;
    const [saveCommment, a] = await Promise.all([
      commentS.create(comment, topicID, id),
      topicS.increTopicCommentCount(topicID)
    ]);
    this.ctx.helper.renameObjcetKey(saveCommment, { _id: 'id' });

    this.ctx.toSuccess({
      saveCommment,
      a
    });
  }

  async delete() {
    console.log('==');
  }
}

module.exports = CommentController;
