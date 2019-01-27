/*
 * @Author: atony2099
 * @Date: 2018-12-13 11:51:13
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 06:07:08
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const TopicSchema = new Schema({
    __v: {
      type: Number,
      select: false
    },
    content: {
      type: String
    },
    author: {
      type: ObjectId,
      ref: 'User'
    },
    visit_count: {
      type: Number,
      default: 0
    },
    reply_count: {
      type: Number,
      default: 0
    },
    collect_count: {
      type: Number,
      default: 0
    },
    like_count: {
      type: Number,
      default: 0
    },
    like_id: {
      type: [ObjectId],
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    create_at: {
      type: Date,
      default: new Date()
    },
    update_at: {
      type: Date
    }
  });

  TopicSchema.pre('save', function(next) {
    const now = new Date();
    this.update_at = now;
    next();
  });

  return mongoose.model('TopicS', TopicSchema);
};
