const express = require('express');
const path = require('path');
const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, 'build')));

// 所有请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 获取本机IP地址
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  return addresses[0] || 'localhost';
}

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('\n========================================');
  console.log('🎉 随文识字应用已启动！');
  console.log('========================================');
  console.log(`📍 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 网络访问: http://${getLocalIP()}:${PORT}`);
  console.log('\n提示:');
  console.log('- 请确保防火墙允许端口 ' + PORT);
  console.log('- 同一网络下的设备都可以访问');
  console.log('- 按 Ctrl+C 停止服务器');
  console.log('========================================\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在停止服务器...');
  process.exit(0);
});