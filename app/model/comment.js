/*
 * @Author: atony2099
 * @Date: 2019-01-24 14:39:09
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 22:13:48
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const CommentSchema = new Schema({
    __v: {
      type: Number,
      select: false
    },
    content: {
      type: String
    },

    topic: {
      type: ObjectId,
      ref: 'Topic'
    },

    author: {
      type: ObjectId,
      ref: 'User'
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

  CommentSchema.pre('save', function(next) {
    const now = new Date();
    this.create_at = now;
    this.update_at = now;
    next();
  });

  return mongoose.model('Commment', CommentSchema);
};
