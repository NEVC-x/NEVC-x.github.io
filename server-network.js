const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'build')));

// 所有请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 获取本机IP地址
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
}

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  const ips = getLocalIPs();

  console.log('\n🚀 随文识字应用已启动！');
  console.log('================================');
  console.log('📱 本地访问地址：');
  console.log(`   http://localhost:${port}`);
  console.log('');

  if (ips.length > 0) {
    console.log('🌐 网络访问地址（同一WiFi下）：');
    ips.forEach(ip => {
      console.log(`   http://${ip}:${port}`);
    });
    console.log('');
  }

  console.log('📋 分享给朋友：');
  if (ips.length > 0) {
    console.log(`   复制上面的网络地址分享给朋友`);
  } else {
    console.log(`   请确保设备连接在同一网络`);
  }
  console.log('================================\n');

  // 提示如何停止服务器
  console.log('⏹️  停止服务器：按 Ctrl+C\n');
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 服务器已停止');
  process.exit(0);
});