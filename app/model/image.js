/*
 * @Author: atony2099
 * @Date: 2018-12-13 16:55:27
 * @Last Modified by:   atony2099
 * @Last Modified time: 2018-12-13 16:55:27
 */


'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  const TopicSchema = new Schema({
    content: { type: String },
    author_id: { type: ObjectId },

    visit_count: { type: Number, default: 0 },
    reply_count: { type: Number },
    collect_count: {},
    deleted: { type: Boolean },

    create_at: {
      type: Date,
      default: new Date(),
    },
    update_at: { type: Date },
  });

  return mongoose.model('Topic', TopicSchema);

};
