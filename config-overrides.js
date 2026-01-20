const { override } = require('customize-cra');

module.exports = override(
  config => {
    // 配置开发服务器
    config.devServer = {
      ...config.devServer,
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: 'all',
      disableHostCheck: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      }
    };
    return config;
  }
);