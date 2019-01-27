/*
 * @Author: atony2099
 * @Date: 2018-12-06 16:20:17
 * @Last Modified by: atony2099
 * @Last Modified time: 2018-12-25 02:11:46
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    open_id: { type: String, unique: true },
    uuid: { type: String },
    skey: { type: String }, // token
    session_key: { type: String },
    create_at: {
      type: Date,
      default: Date.now(),
    },
    update_at: { type: Date },
    user_info: { type: String },
    nickName: { type: String },
    gender: { type: Number },
    __v: {
      type: Number,
      select: false,
    },
    like_count: { type: Number, default: 0 },
    topic_count: { type: Number, default: 0 },
    avatar_url: { type: String },

  });

  UserSchema.pre('save', function(next) {
    const now = new Date();
    this.update_at = now;
    next();
  });

  return mongoose.model('User', UserSchema);

};
