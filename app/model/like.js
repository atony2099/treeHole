/*
 * @Author: atony2099
 * @Date: 2018-12-17 12:21:10
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-17 16:58:18
 */

'use strict';

module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;
  const { ObjectId } = Schema;

  const LikeSchema = new Schema({
    topic_id: { type: ObjectId, ref: 'Topic' },
    user_id: { type: ObjectId, ref: 'User' },
    create_at: { type: Date, default: new Date() },
    update_at: { type: Date },
  });
  LikeSchema.pre('save', function(next) {
    const now = new Date();
    this.update_at = now;
    next();
  });
  return mongoose.model('Like', LikeSchema);

};
