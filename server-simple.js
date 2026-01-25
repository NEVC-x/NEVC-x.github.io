const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'build')));

// 所有请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 随文识字应用运行在 http://localhost:${port}`);
  console.log(`🌐 网络访问: http://localhost:${port}`);
});