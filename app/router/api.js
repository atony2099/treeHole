/*
 * @Author: atony2099
 * @Date: 2018-12-02 00:35:08
 * @Last Modified by: atony2099
 * @Last Modified time: 2019-01-27 19:40:03
 */
'use strict';
module.exports = app => {
  const router = app.router.namespace('/api');
  const { validate, createTopicLimit, pagination, skeyTake } = app.middlewares;
  const { user, topic, like, comment } = app.controller;
  // user
  router.post('/wc_login', user.login);

  // topic
  router.get('/topic', skeyTake(), topic.index);
  router.post('/topic/create', validate(), createTopicLimit({}, app), topic.create);
  router.post('/topic/delete', validate(), topic.delete);
  router.get('/topic/list', skeyTake(), pagination(), topic.list);
  router.get('/topic/hotest', skeyTake(), topic.hotest);
  router.get('/topic/list', skeyTake(), pagination(), topic.list);

  // like
  router.post('/topic/like', validate(), like.index);

  // comment
  router.get('/comment/list', comment.list);
  router.post('/comment/create', validate(), comment.create);

  // user
  router.get('/user/info', user.getUser);
};
