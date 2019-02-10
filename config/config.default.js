'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543669120381_7198';

  // add your config here
  config.middleware = [];
  config.security = {
    csrf: {
      enable: false
    }
  };
  config.middleware = ['errorHandle'];
  config.wechatID = 'wx8cd32cdfbcc5afb7';
  config.wechatSecret = 'cf6ea6d8d3bcd93263dd321fba621765';

  config.logger = {
    consoleLevel: 'DEBUG'
  };

  config.wxLoginExpire = 0;
  config.createLimitCount = 100;

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/treehole',
    options: {
      server: { poolSize: 20 }
    }
  };

  config.redis = {
    client: {
      host: process.env.EGG_REDIS_HOST || '127.0.0.1',
      port: process.env.EGG_REDIS_PORT || 6379,
      password: process.env.EGG_REDIS_PASSWORD || '',
      db: process.env.EGG_REDIS_DB || '0'
    }
  };

  return config;
};
